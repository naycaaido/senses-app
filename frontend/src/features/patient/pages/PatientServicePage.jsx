import { useCallback, useEffect, useState } from "react";
import ServiceCard from "../../../shared/components/service/ServiceCard.jsx";
import { getActiveServices } from "../../../shared/services/layananApi.js";

export default function PatientServicePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setServices(await getActiveServices());
    } catch (requestError) {
      setError(requestError.message || "Layanan belum dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return (
    <div>
      <div className='mx-auto max-w-[1200px] px-4 pb-10 pt-6 md:px-6 md:pb-12'>
        <header className='max-w-2xl'>
          <h1 className='m-0 font-serif text-[32px] font-bold leading-[38px] text-[#3d4940] md:text-[40px] md:leading-[46px]'>
            Layanan Sense&rsquo;s
          </h1>
          <p className='mt-2 text-base leading-[26.4px] text-[#6b6b6b]'>
            Dua layanan utama yang bisa Anda pesan secara mandiri. Setiap
            perawatan ditangani dengan prinsip memahami dulu, baru merawat.
          </p>
        </header>

        <div className='grid grid-cols-1 gap-2.5 pt-8 lg:grid-cols-2'>
          {loading && (
            <p
              className='col-span-full py-8 text-center text-[#6b6b6b]'
              role='status'
            >
              Memuat layanan...
            </p>
          )}
          {!loading && error && (
            <div
              className='col-span-full rounded-2xl border border-[#e5c7c1] bg-[#fff5f2] p-5 text-center text-[#8a3324]'
              role='alert'
            >
              <p className='m-0'>{error}</p>
              <button
                type='button'
                className='mt-3 rounded-full bg-[#3d4940] px-4 py-2 text-sm font-medium text-[#fbf8f3] hover:bg-[#0c3320]'
                onClick={loadServices}
              >
                Coba lagi
              </button>
            </div>
          )}
          {!loading && !error && services.length === 0 && (
            <p className='col-span-full py-8 text-center text-[#6b6b6b]'>
              Belum ada layanan yang tersedia saat ini.
            </p>
          )}
          {!loading &&
            !error &&
            services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                reservationPath={`/pasien/reservasi?layanan=${service.id_layanan}`}
              />
            ))}
        </div>

        <aside className='mt-8 flex items-start gap-4 rounded-2xl border border-[#f5edd6] bg-[#f5edd6] p-[21px]'>
          <div className='mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#a8945e]/20'>
            <img className='w-7 h-7' src='/assets/icon-info.svg' alt='' />
          </div>
          <p className='m-0 text-[15px] leading-6 text-[#2c2c2c]'>
            <strong>
              Tindakan medis lain ditentukan oleh dokter saat konsultasi.
            </strong>{" "}
            Untuk kondisi tertentu, dr. Ria Vista Sari, SpDV akan menyusun
            rencana perawatan yang sesuai dengan kebutuhan Anda, bukan paket
            instan.
          </p>
        </aside>
      </div>
    </div>
  );
}
