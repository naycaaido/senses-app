import styles from "../../styles/patient-dashboard.module.css";
import cx from "../../utils/classNames.js";
import { Link } from "react-router-dom";
import QueueCard from "../../components/patient/QueueCard.jsx";

const patient = {
  name: "Annisa",
  initials: "AR",
};

const activeReservation = {
  time: "10:30",
  status: "Menunggu",
  service: "Konsultasi",
  estimatedWait: "25 mnt",
  doctor: "dr. Ria Vista Sari, SpDV",
  specialization: "Spesialis Dermatologi & Venereologi",
  date: "Minggu, 21 Juni 2026",
};

export default function PatientDashboardPage() {
  return (
    <div className={cx(styles, "patient-dashboard")}>
      <div className={cx(styles, "patient-dashboard__greeting")}>
        <h1>Halo, {patient.name}</h1>
        <p>Pantau reservasi Anda secara langsung di sini.</p>
      </div>

      <div className={cx(styles, "patient-dashboard__columns")}>
        <div className={cx(styles, "patient-dashboard__left")}>
          <QueueCard
            time={activeReservation.time}
            status={activeReservation.status}
            service={activeReservation.service}
            estimatedWait={activeReservation.estimatedWait}
          />
        </div>

        <div className={cx(styles, "patient-dashboard__right")}>
          <div className={cx(styles, "active-reservation")}>
            <h2 className={cx(styles, "active-reservation__title")}>Reservasi Aktif</h2>

            <div className={cx(styles, "active-reservation__grid")}>
              <div className={cx(styles, "active-reservation__item")}>
                <div className={cx(styles, "active-reservation__icon")}>
                  <img
                    src='/assets/icon-service.svg'
                    alt=''
                    className={cx(styles, "active-reservation__icon-img")}
                    aria-hidden='true'
                  />
                </div>
                <div>
                  <p className={cx(styles, "active-reservation__label")}>Dokter</p>
                  <p className={cx(styles, "active-reservation__value")}>
                    {activeReservation.doctor}
                  </p>
                  <p className={cx(styles, "active-reservation__sub")}>
                    {activeReservation.specialization}
                  </p>
                </div>
              </div>

              <div className={cx(styles, "active-reservation__item")}>
                <div className={cx(styles, "active-reservation__icon")}>
                  <img
                    src='/assets/icon-check-green.svg'
                    alt=''
                    className={cx(styles, "active-reservation__icon-img")}
                    aria-hidden='true'
                  />
                </div>
                <div>
                  <p className={cx(styles, "active-reservation__label")}>Layanan</p>
                  <p className={cx(styles, "active-reservation__value")}>
                    {activeReservation.service}
                  </p>
                </div>
              </div>

              <div className={cx(styles, "active-reservation__item")}>
                <div className={cx(styles, "active-reservation__icon")}>
                  <img
                    src='/assets/icon-calendar.svg'
                    alt=''
                    className={cx(styles, "active-reservation__icon-img")}
                    aria-hidden='true'
                  />
                </div>
                <div>
                  <p className={cx(styles, "active-reservation__label")}>Tanggal</p>
                  <p className={cx(styles, "active-reservation__value")}>
                    {activeReservation.date}
                  </p>
                </div>
              </div>

              <div className={cx(styles, "active-reservation__item")}>
                <div className={cx(styles, "active-reservation__icon")}>
                  <img
                    src='/assets/icon-clock-dark.svg'
                    alt=''
                    className={cx(styles, "active-reservation__icon-img")}
                    aria-hidden='true'
                  />
                </div>
                <div>
                  <p className={cx(styles, "active-reservation__label")}>Jam</p>
                  <p className={cx(styles, "active-reservation__value")}>
                    {activeReservation.time}
                  </p>
                </div>
              </div>
            </div>

            <div className={cx(styles, "arrival-reminder")}>
              <img
                src='/assets/icon-info-gold.svg'
                alt=''
                className={cx(styles, "arrival-reminder__icon")}
                aria-hidden='true'
              />
              <p className={cx(styles, "arrival-reminder__text")}>
                Mohon datang 15 menit lebih awal dan lakukan registrasi ulang di
                resepsionis.
              </p>
            </div>
          </div>

          <Link to='/pasien/riwayat' className={cx(styles, "history-link")}>
            <div>
              <p className={cx(styles, "history-link__title")}>Riwayat Kunjungan</p>
              <p className={cx(styles, "history-link__desc")}>
                Lihat catatan perawatan Anda sebelumnya
              </p>
            </div>
            <img
              src='/assets/icon-chevron-right.svg'
              alt=''
              className={cx(styles, "history-link__arrow")}
              aria-hidden='true'
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
