import ServiceCard from "../../components/service/ServiceCard.jsx";
import mockServices from "../../mocks/services.js";
import "../../styles/service-card.css";
import "../../styles/patient-service.css";

export default function PatientServicePage() {
  return (
    <div className="patient-service">
      <div className="patient-service__inner">
        <header className="patient-service__header">
          <h1 className="patient-service__title">Layanan Sense&rsquo;s</h1>
          <p className="patient-service__desc">
            Dua layanan utama yang bisa Anda pesan secara mandiri. Setiap
            perawatan ditangani dengan prinsip memahami dulu, baru merawat.
          </p>
        </header>

        <div className="patient-service__grid">
          {mockServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              reservationPath="/pasien/reservasi"
            />
          ))}
        </div>

        <aside className="patient-service__info">
          <div className="patient-service__info-icon">
            <img src="/assets/icon-info.svg" alt="" />
          </div>
          <p className="patient-service__info-text">
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
