import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="placeholder-page">
      <div>
        <h1>404</h1>
        <p>
          Halaman tidak ditemukan. Kembali ke <Link to="/">Beranda</Link>.
        </p>
      </div>
    </div>
  );
}
