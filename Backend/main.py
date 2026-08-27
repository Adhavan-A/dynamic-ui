from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import SQLModel, Field, Session, create_engine, select, or_
from contextlib import asynccontextmanager
import bcrypt
from jose import JWTError, jwt
from typing import Optional
from datetime import datetime, timedelta
import json

# --- DATABASE SETUP ---
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url, echo=False)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# --- SECURITY CONFIG ---
SECRET_KEY = "my-super-secret-key-please-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login", auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_byte_enc = plain_password.encode('utf-8')
    hashed_password_byte_enc = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_byte_enc, hashed_password_byte_enc)

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password=pwd_bytes, salt=salt)
    return hashed_password.decode('utf-8')

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- MODELS ---
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str

class UserCreate(SQLModel):
    username: str
    password: str

class Template(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    name: str
    owner: str = Field(default="guest")
    components: str = Field(default="[]")
    styles: str = Field(default="{}")
    created_at: str
    updated_at: str

# --- APP SETUP ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="UI Generator API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_session():
    with Session(engine) as session:
        yield session

def get_optional_current_user(token: Optional[str] = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
    except JWTError:
        return None
    user = session.exec(select(User).where(User.username == username)).first()
    return user

# ==================== AUTH ENDPOINTS ====================

@app.post("/api/register")
def register(user: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.username == user.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    db_user = User(username=user.username, hashed_password=get_password_hash(user.password))
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return {"message": "User created successfully"}

@app.post("/api/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "username": user.username}

@app.get("/api/me")
def get_me(current_user: Optional[User] = Depends(get_optional_current_user)):
    if not current_user:
        return {"username": "guest"}
    return {"username": current_user.username}

# ==================== TEMPLATE ENDPOINTS ====================

@app.get("/api/templates")
def get_templates(session: Session = Depends(get_session), current_user: Optional[User] = Depends(get_optional_current_user)):
    owner_name = current_user.username if current_user else "guest"
    templates = session.exec(
        select(Template).where(or_(Template.owner == owner_name, Template.owner == "guest"))
    ).all()
    
    result = []
    for t in templates:
        result.append({
            "id": t.id, "name": t.name, "owner": t.owner,
            "components": json.loads(t.components),
            "styles": json.loads(t.styles),
            "created_at": t.created_at
        })
    return {"success": True, "templates": result}

@app.post("/api/templates")
def create_template(template_data: dict, session: Session = Depends(get_session), current_user: Optional[User] = Depends(get_optional_current_user)):
    template_id = f"tpl_{int(datetime.now().timestamp())}"
    now = datetime.now().isoformat()
    owner_name = current_user.username if current_user else "guest"
    
    db_template = Template(
        id=template_id,
        name=template_data.get("name", "Untitled"),
        owner=owner_name,
        components=json.dumps(template_data.get("components", [])),
        styles=json.dumps(template_data.get("styles", {})),
        created_at=now,
        updated_at=now
    )
    
    session.add(db_template)
    session.commit()
    session.refresh(db_template)
    
    return {"success": True, "message": "Template created", "template": db_template}

@app.delete("/api/templates/{template_id}")
def delete_template(template_id: str, session: Session = Depends(get_session), current_user: Optional[User] = Depends(get_optional_current_user)):
    template = session.get(Template, template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Not found")
    
    owner_name = current_user.username if current_user else "guest"
    if template.owner != owner_name and template.owner != "guest":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    session.delete(template)
    session.commit()
    return {"success": True, "message": "Deleted"}

# ==================== ADMIN ENDPOINT (SIMPLIFIED) ====================

@app.get("/admin/view-data")
def admin_view_data(secret_key: str, session: Session = Depends(get_session)):
    # Unga personal password (idha yaarukkum solladheenga)
    ADMIN_PASSWORD = "Adhav@2004" 
    
    if secret_key != ADMIN_PASSWORD:
        raise HTTPException(status_code=403, detail="Access Denied!")

    all_users = session.exec(select(User)).all()
    all_templates = session.exec(select(Template)).all()
    
    return {
        "success": True,
        "total_users": len(all_users),
        "total_templates": len(all_templates),
        "users": [{"id": u.id, "username": u.username} for u in all_users],
        "templates": [
            {
                "id": t.id, "name": t.name, "owner": t.owner,
                "created_at": t.created_at, "updated_at": t.updated_at
            } for t in all_templates
        ]
    }

# ==================== ROOT & HEALTH ====================

@app.get("/")
def root():
    return {
        "message": "UI Component Generator API is running!",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# ==================== RUN SERVER ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)