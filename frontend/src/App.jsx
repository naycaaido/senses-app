import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import "./styles/global.css";

function LoginPage() {
  return (
    <div className="placeholder-page">
      <div>
        <h1>Login</h1>
        <p>Halaman login akan segera tersedia. Kembali ke <Link to="/">Beranda</Link>.</p>
      </div>
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="placeholder-page">
      <div>
        <h1>Register</h1>
        <p>Halaman register akan segera tersedia. Kembali ke <Link to="/">Beranda</Link>.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
