import styles from "../../styles/patient-service.module.css";
import cx from "../../utils/classNames.js";
import ServiceCard from "../../components/service/ServiceCard.jsx";
import mockServices from "../../mocks/services.js";

export default function PatientServicePage() {
  return (
    <div className={cx(styles, "patient-service")}>
      <div className={cx(styles, "patient-service__inner")}>
        <header className={cx(styles, "patient-service__header")}>
          <h1 className={cx(styles, "patient-service__title")}>Layanan Sense&rsquo;s</h1>
          <p className={cx(styles, "patient-service__desc")}>
            Dua layanan utama yang bisa Anda pesan secara mandiri. Setiap
            perawatan ditangani dengan prinsip memahami dulu, baru merawat.
          </p>
        </header>

        <div className={cx(styles, "patient-service__grid")}>
          {mockServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              reservationPath={`/pasien/reservasi?layanan=${service.id}`}
            />
          ))}
        </div>

        <aside className={cx(styles, "patient-service__info")}>
          <div className={cx(styles, "patient-service__info-icon")}>
            <img src="/assets/icon-info.svg" alt="" />
          </div>
          <p className={cx(styles, "patient-service__info-text")}>
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
