export default function ProfileInfoRow({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="m-0 text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#6b6b6b]">{label}</p>
      <p className="mt-1 break-words text-[15px] font-semibold leading-6 text-[#2c2c2c]">{value}</p>
    </div>
  );
}
