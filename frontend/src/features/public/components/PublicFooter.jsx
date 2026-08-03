export default function PublicFooter() {
  return (
    <footer className="border-t border-[#d8c7b5] bg-[#faf3e9]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 px-5 py-10 md:flex-row md:px-16 md:py-16">
        <div>
          <div className="font-serif text-[22px] font-bold text-[#082518]">Sense&rsquo;s Clinic</div>
          <div className="mt-3 text-sm leading-[21.7px] text-[#9a8b7c]">
            &copy; 2024 Sense&rsquo;s Clinic. Premium Dermatology &amp;
            Wellness.
          </div>
        </div>
        <div className="flex flex-wrap gap-6 md:gap-12">
          <a className="text-sm text-[#9a8b7c] opacity-90 hover:text-[#082518]" href='#layanan'>Tentang Kami</a>
          <a className="text-sm text-[#9a8b7c] opacity-90 hover:text-[#082518]" href='#layanan'>Kebijakan Privasi</a>
          <a className="text-sm text-[#9a8b7c] opacity-90 hover:text-[#082518]" href='#layanan'>Kontak</a>
          <a className="text-sm text-[#9a8b7c] opacity-90 hover:text-[#082518]" href='#layanan'>Bantuan</a>
        </div>
      </div>
    </footer>
  );
}
