export default function HistorySearch({ value, onChange }) {
  return (
    <div className="relative w-full shrink-0 min-[901px]:w-80">
      <img
        src="/assets/icon-search.svg"
        alt=""
        className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2"
        aria-hidden="true"
      />
      <label
        htmlFor="patient-history-search"
        className="sr-only"
      >
        Cari riwayat kunjungan
      </label>
      <input
        id="patient-history-search"
        type="text"
        className="w-full rounded-full border border-[#e5e7eb] bg-[#faf7f2] py-[11px] pl-[41px] pr-[13px] text-sm text-[#3d4940] outline-none placeholder:text-[#6b7280] focus:border-[#b99b57]"
        placeholder="Cari layanan atau ID..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Cari layanan atau ID"
      />
    </div>
  );
}
