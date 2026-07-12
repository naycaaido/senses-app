import ServiceCard from "../components/service/ServiceCard.jsx";
import mockServices from "../mocks/services.js";
import "../styles/service-card.css";
import "../styles/service-catalog.css";

export default function ServiceCatalogPage() {
  return (
    <div className="service-catalog">
      <div className="service-catalog__inner">
        <header className="service-catalog__header">
          <h1 className="service-catalog__title">Layanan Sense&rsquo;s</h1>
          <p className="service-catalog__desc">
            Dua layanan utama yang bisa Anda pesan secara mandiri. Setiap
            perawatan ditangani dengan prinsip memahami dulu, baru merawat.
          </p>
        </header>

        <div className="service-catalog__grid">
          {mockServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              reservationPath="/login"
            />
          ))}
        </div>

        <aside className="service-catalog__info">
          <div className="service-catalog__info-icon">
            <img src="/assets/icon-info.svg" alt="" />
          </div>
          <p className="service-catalog__info-text">
            <strong>Tindakan medis lain ditentukan oleh dokter saat konsultasi.</strong>{" "}
            Untuk kondisi tertentu, dr. Ria Vista Sari, SpDV akan menyusun
            rencana perawatan yang sesuai dengan kebutuhan Anda, bukan paket
            instan.
          </p>
        </aside>
      </div>
    </div>
  );
}
