import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Toast from './components/Toast.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Generator from './pages/Generator.jsx';
import Templates from './pages/Templates.jsx';
import Export from './pages/Export.jsx';
import Auth from './pages/Auth.jsx';
import History from './pages/History.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/export" element={<Export />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Toast />
      <Footer />
    </>
  );
}