import styles from "../styles/service-catalog.module.css";
import cx from "../utils/classNames.js";
import ServiceCard from "../components/service/ServiceCard.jsx";
import mockServices from "../mocks/services.js";

export default function ServiceCatalogPage() {
  return (
    <div className={cx(styles, "service-catalog")}>
      <div className={cx(styles, "service-catalog__inner")}>
        <header className={cx(styles, "service-catalog__header")}>
          <h1 className={cx(styles, "service-catalog__title")}>Layanan Sense&rsquo;s</h1>
          <p className={cx(styles, "service-catalog__desc")}>
            Dua layanan utama yang bisa Anda pesan secara mandiri. Setiap
            perawatan ditangani dengan prinsip memahami dulu, baru merawat.
          </p>
        </header>

        <div className={cx(styles, "service-catalog__grid")}>
          {mockServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              reservationPath="/login"
            />
          ))}
        </div>

        <aside className={cx(styles, "service-catalog__info")}>
          <div className={cx(styles, "service-catalog__info-icon")}>
            <img src="/assets/icon-info.svg" alt="" />
          </div>
          <p className={cx(styles, "service-catalog__info-text")}>
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
