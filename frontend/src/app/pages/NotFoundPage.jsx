import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-clinic-cream p-6 text-center">
      <div>
        <h1 className="mb-2 font-serif text-4xl text-clinic-dark">404</h1>
        <p className="text-clinic-text">
          Halaman tidak ditemukan. Kembali ke <Link to="/" className="font-semibold text-clinic-gold">Beranda</Link>.
        </p>
      </div>
    </div>
  );
}
