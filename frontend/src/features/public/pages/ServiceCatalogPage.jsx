import ServiceCard from "../../../shared/components/service/ServiceCard.jsx";
import mockServices from "../../../shared/data/services.js";

export default function ServiceCatalogPage() {
  return (
    <div className="bg-[#fbf8f3]">
      <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-6 md:px-6 md:pb-12">
        <header className="max-w-2xl">
          <h1 className="m-0 font-serif text-[32px] font-bold leading-[38px] text-[#3d4940] md:text-[40px] md:leading-[46px]">Layanan Sense&rsquo;s</h1>
          <p className="mt-2 text-base leading-[26.4px] text-[#6b6b6b]">
            Dua layanan utama yang bisa Anda pesan secara mandiri. Setiap
            perawatan ditangani dengan prinsip memahami dulu, baru merawat.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-2.5 pt-8 lg:grid-cols-2">
          {mockServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              reservationPath="/login"
            />
          ))}
        </div>

        <aside className="mt-8 flex items-start gap-4 rounded-2xl border border-[#f5edd6] bg-[#f5edd6] p-[21px]">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#a8945e]/20">
            <img src="/assets/icon-info.svg" alt="" />
          </div>
          <p className="m-0 text-[15px] leading-6 text-[#2c2c2c]">
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
