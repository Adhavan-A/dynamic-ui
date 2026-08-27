# Dynamic UI & Animation Generator — React + Vite

A no-code visual builder for UI components and CSS animations. Drag elements onto
a canvas, style them, animate them, and export production-ready HTML/CSS/JS.

## Tech stack

- **React 19 + Vite** — app shell and dev server
- **Tailwind CSS v4** — styling (via the official `@tailwindcss/vite` plugin, no config file needed)
- **react-router-dom** — the four pages (Home, Generator, Templates, Export)
- **highlight.js** — syntax-highlighted code viewer (used in place of Monaco Editor,
  which needs a heavier AMD-loader setup outside of a plain Vite build)
- **JSZip** — bundles the generated HTML/CSS/JS into a downloadable `.zip`

> This is a front-end-only build. There's no FastAPI backend because nothing here
> needs a server — canvas state lives in React state and code generation runs
> entirely in the browser. If you want a backend anyway (e.g. to save projects to
> a database or add user accounts), see **"Adding a backend"** below.

## Project structure

```
src/
  components/
    Navbar.jsx
    Toast.jsx
    CodeBlock.jsx              # syntax-highlighted <pre><code>
    generator/
      Palette.jsx              # draggable element list
      LayersPanel.jsx          # layer list: select / reorder / delete
      Canvas.jsx                # drop target, renders CanvasElement list
      CanvasElement.jsx        # a single element: move, resize, typing preview
      StylePanel.jsx           # color/typography/spacing/shadow controls
      AnimationPanel.jsx       # animation type + duration/delay/easing controls
      CodeDrawer.jsx           # collapsible live HTML/CSS/JS viewer
  data/
    templates.js               # 6 ready-made template presets
  lib/
    constants.js                # element defaults, shadows, animation keyframes
    codegen.js                  # generateHTML / generateCSS / generateJS
    BuilderContext.jsx         # React Context holding all canvas state + actions
  pages/
    Home.jsx
    Generator.jsx
    Templates.jsx
    Export.jsx
  App.jsx
  main.jsx
  index.css                    # Tailwind import + theme tokens + @keyframes
```

## Step-by-step: how this was built (so you can redo it yourself)

1. **Scaffold the app**
   ```bash
   npm create vite@latest dynamic-ui-react -- --template react
   cd dynamic-ui-react
   npm install
   ```

2. **Install dependencies**
   ```bash
   npm install jszip react-router-dom highlight.js lucide-react
   npm install -D tailwindcss @tailwindcss/vite
   ```

3. **Wire up Tailwind v4** — add the plugin to `vite.config.js`:
   ```js
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'
   import { defineConfig } from 'vite'

   export default defineConfig({
     plugins: [react(), tailwindcss()],
   })
   ```
   and add a single line at the top of `src/index.css`:
   ```css
   @import "tailwindcss";
   ```

4. **Model the data** (`src/lib/constants.js`) — one object per element type
   (heading/text/button/card/image/input) with default width/height/content/styles,
   plus a shared `animation` shape `{ type, duration, delay, iteration, infinite, easing }`.

5. **Centralize state** (`src/lib/BuilderContext.jsx`) — a React Context exposing
   `elements`, `selectedId`, and actions (`addElement`, `updateElement`, `updateStyle`,
   `updateAnimation`, `deleteElement`, `moveLayer`, `loadElements`, `resetCanvas`).
   Every panel reads/writes through this context instead of prop-drilling.

6. **Build the canvas** (`Canvas.jsx` + `CanvasElement.jsx`) — HTML5 drag-and-drop
   from the palette creates new elements; plain `mousedown`/`mousemove`/`mouseup`
   listeners handle moving and resizing existing ones.

7. **Build the code generator** (`src/lib/codegen.js`) — pure functions that turn
   the `elements` array into an HTML document, a CSS stylesheet (only emitting the
   `@keyframes` blocks actually used), and a JS file (only emitted when a "Typing
   Text" animation is present). These are reused by both the in-app code drawer
   and the Export page, so the preview and the download always match.

8. **Wire up export** — `JSZip` bundles the three generated files into a `.zip`;
   `navigator.clipboard.writeText` handles the individual "Copy" buttons.

9. **Add routing** (`react-router-dom`) for Home / Generator / Templates / Export.

## Running it locally

```bash
npm install
npm run dev
```
Then open the URL Vite prints (typically `http://localhost:5173`).

To build a static production bundle:
```bash
npm run build    # outputs to dist/
npm run preview  # serve the production build locally to sanity-check it
```

## Adding a backend (optional)

If you later want to persist projects, add user accounts, or share designs by
URL, a small FastAPI service is a natural fit:

```
POST /api/projects        # save {elements: [...]} as JSON
GET  /api/projects/{id}   # load a saved project
```

On the frontend, that just means swapping `resetCanvas`/`loadElements` calls in
`BuilderContext.jsx` for `fetch()` calls to those endpoints — the canvas, style
panel, animation panel, and code generator don't need to change at all, since
they only ever talk to `elements` in context, not to `localStorage` or the DOM
directly.
