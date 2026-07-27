import { Link } from "react-router-dom";

export default function NoActiveReservationState({ firstName }) {
  return (
    <div className='mx-auto max-w-[1200px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6'>
      <header className='mb-6'>
        <h1 className='mt-2 font-serif text-[28px] font-bold leading-[34px] text-[#3d4940] md:text-[40px] md:leading-[46px]'>
          Halo {firstName}
        </h1>
        <p className='mt-1 text-[15px] leading-6 text-[#6b6b6b]'>
          Pantau reservasi Anda secara langsung di sini.
        </p>
      </header>

      <div className='flex flex-col items-stretch gap-6 min-[1025px]:items-start min-[1025px]:flex-row'>
        <aside className='w-full shrink-0 overflow-hidden rounded-2xl bg-[#3d4940] shadow-[0_1px_3px_rgba(44,44,44,0.06),0_12px_32px_-16px_rgba(61,73,64,0.22)] min-[1025px]:w-[360px]'>
          <div className='flex min-h-[300px] flex-col items-center justify-center px-7 py-9 text-center'>
            <div className='flex size-16 items-center justify-center rounded-full border border-[#a8945e]/40 bg-[#f5edd6]'>
              <img src='/assets/icon-calendar.svg' alt='' className='size-7' aria-hidden='true' />
            </div>
            <p className='mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#fbf8f3]/70'>
              Belum ada jadwal
            </p>
            <h2 className='mt-2 font-serif text-[30px] font-bold leading-9 text-[#fbf8f3]'>
              Waktu Anda masih fleksibel
            </h2>
            <p className='mt-3 max-w-[250px] text-[15px] leading-6 text-[#fbf8f3]/80'>
              Pilih layanan dan jadwal yang paling nyaman untuk Anda.
            </p>
          </div>
          <div className='border-t border-[#fbf8f3]/15 bg-[#5c6b5e]/40 px-6 py-5 text-center text-sm leading-5 text-[#fbf8f3]/70'>
            Reservasi yang dibuat akan tampil di kartu ini.
          </div>
        </aside>

        <section className='flex min-w-0 flex-1 flex-col gap-4'>
          <div className='rounded-2xl border border-[#f0ede7] bg-white p-5 md:p-[25px]'>
            <div className='flex flex-col items-start gap-5 sm:flex-row sm:items-center'>
              <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-[#ebf0eb]'>
                <img src='/assets/icon-calendar.svg' alt='' className='size-5' aria-hidden='true' />
              </div>
              <div className='min-w-0 flex-1'>
                <h2 className='m-0 font-serif text-[22px] font-bold leading-[28.6px] text-[#3d4940]'>
                  Siap merencanakan kunjungan?
                </h2>
                <p className='mt-1 text-[15px] leading-6 text-[#6b6b6b]'>
                  Pilih layanan terlebih dahulu, kemudian tentukan tanggal dan jam yang tersedia.
                </p>
              </div>
            </div>

            <div className='mt-6 grid grid-cols-1 gap-3 border-y border-[#f0ede7] py-5 sm:grid-cols-3'>
              {[
                ["1", "Pilih layanan", "Temukan perawatan yang Anda butuhkan."],
                ["2", "Tentukan jadwal", "Pilih tanggal dan jam yang tersedia."],
                ["3", "Konfirmasi", "Simpan reservasi Anda dengan mudah."],
              ].map(([number, title, description]) => (
                <div key={number} className='flex gap-3 px-1 sm:px-3'>
                  <span className='flex size-7 shrink-0 items-center justify-center rounded-full bg-[#ebf0eb] text-xs font-bold text-[#3d4940]'>
                    {number}
                  </span>
                  <div>
                    <p className='m-0 text-sm font-semibold text-[#2c2c2c]'>{title}</p>
                    <p className='mt-0.5 text-xs leading-5 text-[#6b6b6b]'>{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to='/pasien/layanan' className='mt-6 inline-flex items-center gap-2 rounded-full bg-[#3d4940] px-5 py-2.5 text-[15px] font-medium leading-6 text-[#fbf8f3] transition-colors hover:bg-[#0c3320]'>
              Buat Reservasi
              <img src='/assets/icon-arrow-right.svg' alt='' className='size-[16.5px]' aria-hidden='true' />
            </Link>
          </div>

          <Link to='/pasien/riwayat' className='flex items-center justify-between rounded-2xl border border-[#f0ede7] bg-white p-[21px] transition-colors hover:bg-[#faf7f2]'>
            <div>
              <p className='m-0 font-serif text-base font-bold leading-[26.4px] text-[#3d4940]'>Riwayat Kunjungan</p>
              <p className='m-0 text-xs leading-4 tracking-[0.06em] text-[#6b6b6b]'>
                Lihat catatan perawatan Anda sebelumnya
              </p>
            </div>
            <img src='/assets/icon-chevron-right.svg' alt='' className='size-5 shrink-0' aria-hidden='true' />
          </Link>
        </section>
      </div>
    </div>
  );
}
