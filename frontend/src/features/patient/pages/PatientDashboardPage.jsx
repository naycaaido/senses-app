import { Link } from "react-router-dom";
import QueueCard from "../components/QueueCard.jsx";

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
    <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6">
      <div className="mb-6">
        <h1 className="m-0 font-serif text-[28px] font-bold leading-[34px] text-[#3d4940] md:text-[40px] md:leading-[46px]">Halo, {patient.name}</h1>
        <p className="mt-1 text-[15px] leading-6 text-[#6b6b6b]">Pantau reservasi Anda secara langsung di sini.</p>
      </div>

      <div className="flex flex-col items-stretch gap-6 min-[1025px]:items-start min-[1025px]:flex-row">
        <div className="w-full shrink-0 min-[1025px]:w-[360px]">
          <QueueCard
            time={activeReservation.time}
            status={activeReservation.status}
            service={activeReservation.service}
            estimatedWait={activeReservation.estimatedWait}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="rounded-2xl border border-[#f0ede7] bg-white p-5 md:p-[25px]">
            <h2 className="mb-5 font-serif text-[22px] font-bold leading-[28.6px] text-[#3d4940]">Reservasi Aktif</h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ebf0eb]">
                  <img
                    src='/assets/icon-service.svg'
                    alt=''
                    className="size-4"
                    aria-hidden='true'
                  />
                </div>
                <div>
                  <p className="m-0 text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]">Dokter</p>
                  <p className="m-0 text-[15px] font-semibold leading-6 text-[#2c2c2c]">
                    {activeReservation.doctor}
                  </p>
                  <p className="m-0 text-xs leading-4 tracking-[0.06em] text-[#6b6b6b]">
                    {activeReservation.specialization}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ebf0eb]">
                  <img
                    src='/assets/icon-check-green.svg'
                    alt=''
                    className="size-4"
                    aria-hidden='true'
                  />
                </div>
                <div>
                  <p className="m-0 text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]">Layanan</p>
                  <p className="m-0 text-[15px] font-semibold leading-6 text-[#2c2c2c]">
                    {activeReservation.service}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ebf0eb]">
                  <img
                    src='/assets/icon-calendar.svg'
                    alt=''
                    className="size-4"
                    aria-hidden='true'
                  />
                </div>
                <div>
                  <p className="m-0 text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]">Tanggal</p>
                  <p className="m-0 text-[15px] font-semibold leading-6 text-[#2c2c2c]">
                    {activeReservation.date}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ebf0eb]">
                  <img
                    src='/assets/icon-clock-dark.svg'
                    alt=''
                    className="size-4"
                    aria-hidden='true'
                  />
                </div>
                <div>
                  <p className="m-0 text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]">Jam</p>
                  <p className="m-0 text-[15px] font-semibold leading-6 text-[#2c2c2c]">
                    {activeReservation.time}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#f5edd6] p-4">
              <img
                src='/assets/icon-info-gold.svg'
                alt=''
                className="mt-0.5 size-5 shrink-0"
                aria-hidden='true'
              />
              <p className="m-0 text-[15px] leading-6 text-[#2c2c2c]">
                Mohon datang 15 menit lebih awal dan lakukan registrasi ulang di
                resepsionis.
              </p>
            </div>
          </div>

          <Link to='/pasien/riwayat' className="flex items-center justify-between rounded-2xl border border-[#f0ede7] bg-white p-[21px] hover:bg-[#faf7f2]">
            <div>
              <p className="m-0 font-serif text-base font-bold leading-[26.4px] text-[#3d4940]">Riwayat Kunjungan</p>
              <p className="m-0 text-xs leading-4 tracking-[0.06em] text-[#6b6b6b]">
                Lihat catatan perawatan Anda sebelumnya
              </p>
            </div>
            <img
              src='/assets/icon-chevron-right.svg'
              alt=''
              className="size-5 shrink-0"
              aria-hidden='true'
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
