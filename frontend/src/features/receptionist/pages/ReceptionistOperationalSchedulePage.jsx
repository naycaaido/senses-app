import { useEffect, useMemo, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "../components/Icons.jsx";
import { Button, Modal } from "../components/ui.jsx";
import {
  getReceptionistSchedules,
  setAllReceptionistScheduleStatus,
  setReceptionistScheduleStatus,
} from "../../../shared/services/receptionistApi.js";
import { cx } from "../utils/cx.js";
import { PageHeader } from "../components/ui.jsx";

const WEEKDAYS = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const formatDate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const dateFromString = (value) => new Date(`${value}T00:00:00`);
const time = (value) => value?.replace(":", ".") || "—";

function Toggle({ checked, disabled, onChange, label }) {
  return (
    <button
      role='switch'
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cx(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed",
        checked ? "bg-[#3d4940]" : "bg-[#d4d4d4]",
        disabled && "opacity-50",
      )}
    >
      <span
        className={cx(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

export default function JadwalOperasional() {
  const initialDate = formatDate(new Date());
  const [cursor, setCursor] = useState(() => dateFromString(initialDate));
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [batchStatus, setBatchStatus] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setSlots(await getReceptionistSchedules(selectedDate));
    } catch (requestError) {
      setSlots([]);
      setError(requestError.message || "Jadwal tidak dapat dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [selectedDate]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells = useMemo(() => {
    const result = [];
    for (let i = firstWeekday - 1; i >= 0; i--)
      result.push({ day: daysInPrev - i, muted: true });
    for (let d = 1; d <= daysInMonth; d++)
      result.push({ day: d, muted: false });
    return result;
  }, [firstWeekday, daysInPrev, daysInMonth]);

  const summary = useMemo(
    () => ({
      active: slots.filter(
        (slot) => slot.status_jadwal === "Aktif" && !slot.no_reservasi,
      ).length,
      inactive: slots.filter((slot) => slot.status_jadwal === "Nonaktif")
        .length,
      booked: slots.filter((slot) => slot.no_reservasi).length,
    }),
    [slots],
  );

  const toggleSlot = async (slot) => {
    if (slot.no_reservasi) return;
    const nextStatus = slot.status_jadwal === "Aktif" ? "Nonaktif" : "Aktif";
    setBusy(String(slot.id_jadwal));
    setError("");
    try {
      const updated = await setReceptionistScheduleStatus(
        slot.id_jadwal,
        nextStatus,
      );
      setSlots((current) =>
        current.map((item) =>
          item.id_jadwal === updated.id_jadwal ? updated : item,
        ),
      );
      // setNotice("Status slot berhasil diperbarui.");
    } catch (requestError) {
      // setError(requestError.message || "Status slot tidak dapat diubah.");
    } finally {
      setBusy("");
    }
  };

  const confirmBatch = async () => {
    setBusy("batch");
    setError("");
    try {
      const result = await setAllReceptionistScheduleStatus({
        tanggal: selectedDate,
        status: batchStatus,
      });
      setSlots(result.data);
      // setNotice(
      //   `${result.updated_count} slot diperbarui${result.skipped_booked_count ? `; ${result.skipped_booked_count} slot terpesan tetap terkunci.` : "."}`,
      // );
      setBatchStatus(null);
    } catch (requestError) {
      // setError(requestError.message || "Status jadwal tidak dapat diubah.");
    } finally {
      setBusy("");
    }
  };

  const selectedDateObject = dateFromString(selectedDate);

  return (
    <div className='flex flex-col gap-[22px]'>
      {/* ── Page Header ── */}
      <PageHeader title='Kelola Ketersediaan Jadwal' />

      {/* ── Calendar + Stats Row ── */}
      <div className='flex gap-5'>
        {/* Calendar Widget */}
        <div className='flex w-full w-full flex-col gap-5 rounded-[12px] bg-white p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]'>
          <div className='flex items-center justify-between'>
            <p className='text-[20px] font-semibold text-[#1e293b]'>Kalender</p>
            <div className='flex'>
              <button
                onClick={() => setCursor(new Date(year, month - 1, 1))}
                aria-label='Bulan sebelumnya'
                className='rounded-[8px] p-[4px] pb-[10px] pt-[4px] text-[#1e293b] transition-colors hover:bg-[#f5f5f3]'
              >
                <IconChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCursor(new Date(year, month + 1, 1))}
                aria-label='Bulan berikutnya'
                className='rounded-[8px] p-[4px] pb-[10px] pt-[4px] text-[#1e293b] transition-colors hover:bg-[#f5f5f3]'
              >
                <IconChevronRight size={16} />
              </button>
            </div>
          </div>

          <p className='text-[15px] font-semibold text-[#1e293b]'>
            {MONTHS_ID[month]} {year}
          </p>

          <div className='grid grid-cols-7'>
            {WEEKDAYS.map((d) => (
              <span
                key={d}
                className='pb-[16px] text-center text-[11px] font-semibold uppercase tracking-[0.55px] text-[#737686]'
              >
                {d}
              </span>
            ))}
            {cells.map((cell, i) => {
              const dateStr = cell.muted
                ? ""
                : `${year}-${String(month + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
              const isSelected = !cell.muted && selectedDate === dateStr;

              return (
                <div
                  key={i}
                  className='relative flex items-center justify-center pb-[20.5px] pt-[9.5px]'
                >
                  <button
                    disabled={cell.muted}
                    onClick={() => {
                      setNotice("");
                      setSelectedDate(dateStr);
                    }}
                    className={cx(
                      "flex size-10 items-center justify-center text-[14px] transition-colors",
                      cell.muted
                        ? "cursor-default text-[#c3c6d7]"
                        : isSelected
                          ? "rounded-[8px] bg-[#3d4940] font-bold text-white"
                          : "rounded-[8px] font-semibold text-[#1e293b] hover:bg-[#f5f5f3]",
                    )}
                  >
                    {cell.day}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats + Actions */}
        <div className='flex w-full flex-col gap-5'>
          <div className='flex flex-wrap gap-[14px]'>
            <div className='flex w-[calc(50%-7px)] flex-col gap-[5px] rounded-[16px] border border-[#ece7df] bg-[rgba(255,255,255,0.75)] p-5'>
              <p className='text-[11px] font-bold uppercase tracking-[1px] text-[#747873]'>
                Total Slot
              </p>
              <p className='font-serif text-[30px] text-[#3d4940]'>
                {slots.length}
              </p>
              <p className='text-[14px] text-[#747873]'>
                Pada tanggal terpilih
              </p>
            </div>
            <div className='flex w-[calc(50%-7px)] flex-col gap-[5px] rounded-[16px] border border-[#ece7df] bg-[rgba(255,255,255,0.75)] p-5'>
              <p className='text-[11px] font-bold uppercase tracking-[1px] text-[#747873]'>
                Slot Aktif
              </p>
              <p className='font-serif text-[30px] text-[#3d4940]'>
                {summary.active}
              </p>
              <p className='text-[14px] text-[#747873]'>Dapat dipilih pasien</p>
            </div>
            <div className='flex w-[calc(50%-7px)] flex-col gap-[5px] rounded-[16px] border border-[#ece7df] bg-[rgba(255,255,255,0.75)] p-5'>
              <p className='text-[11px] font-bold uppercase tracking-[1px] text-[#747873]'>
                Slot Nonaktif
              </p>
              <p className='font-serif text-[30px] text-[#3d4940]'>
                {summary.inactive}
              </p>
              <p className='text-[14px] text-[#747873]'>
                Jadwal tidak tersedia
              </p>
            </div>
            <div className='flex w-[calc(50%-7px)] flex-col gap-[5px] rounded-[16px] border border-[#eadcb6] bg-[#f6eedb] p-5'>
              <p className='text-[11px] font-bold uppercase tracking-[1px] text-[#747873]'>
                Sudah Dipesan
              </p>
              <p className='font-serif text-[30px] text-[#3d4940]'>
                {summary.booked}
              </p>
              <p className='text-[14px] text-[#747873]'>Tidak dapat diubah</p>
            </div>
          </div>

          <div className='flex gap-[10px] rounded-[10px] p-[10px]'>
            <button
              disabled={!slots.length || busy === "batch"}
              onClick={() => setBatchStatus("Nonaktif")}
              className='flex h-11 flex-1 items-center justify-center rounded-[10px] border border-[#ece7df] bg-white px-[18px] text-[13px] font-bold text-[#3d4940] transition-colors hover:bg-[#f5f5f3] disabled:cursor-not-allowed disabled:opacity-50'
            >
              Nonaktifkan Semua
            </button>
            <button
              disabled={!slots.length || busy === "batch"}
              onClick={() => setBatchStatus("Aktif")}
              className='flex h-11 flex-1 items-center justify-center rounded-[10px] border border-[#ece7df] bg-[#e9eee9] px-[18px] text-[13px] font-bold text-[#3d4940] transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50'
            >
              Aktifkan Semua
            </button>
          </div>
        </div>
      </div>

      {/* ── Schedule Card ── */}
      <div className='w-full rounded-[18px] border border-[#ece7df] bg-white p-[26px] shadow-[0_16px_40px_0_rgba(61,73,64,0.08)]'>
        <div className='flex flex-wrap items-start justify-between gap-3 border-b border-[#ece7df] pb-[22px]'>
          <div>
            <p className='font-serif text-[24px] font-medium text-[#3d4940]'>
              {selectedDateObject.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className='mt-[9px] text-[14px] text-[#747873]'>
              Aktifkan slot saat dokter tersedia untuk praktik.
            </p>
          </div>
          <div className='flex items-center gap-[14px] pt-[4px]'>
            <span className='flex items-center gap-[7px] text-[12px] text-[#747873]'>
              <span className='size-[8px] rounded-full bg-[#3d4940]' />
              Aktif
            </span>
            <span className='flex items-center gap-[7px] text-[12px] text-[#747873]'>
              <span className='size-[8px] rounded-full bg-[#d4d4d4]' />
              Nonaktif
            </span>
            <span className='flex items-center gap-[7px] text-[12px] text-[#747873]'>
              <span className='size-[8px] rounded-full bg-[#e3c97f]' />
              Dipesan
            </span>
          </div>
        </div>

        {error && (
          <p className='mt-5 rounded-[12px] bg-[#fdf1f1] px-4 py-3 text-[13px] text-[#a03d4a]'>
            {error}
          </p>
        )}
        {notice && (
          <p className='mt-5 rounded-[12px] bg-[#ebf0eb] px-4 py-3 text-[13px] text-[#3d4940]'>
            {notice}
          </p>
        )}

        {loading ? (
          <p className='py-10 text-center text-[14px] text-[#747873]'>
            Memuat jadwal…
          </p>
        ) : slots.length === 0 ? (
          <p className='py-10 text-center text-[14px] text-[#747873]'>
            Belum ada slot jadwal untuk tanggal ini.
          </p>
        ) : (
          <div className='flex flex-wrap gap-3 py-6'>
            {slots.map((slot) => {
              const active = slot.status_jadwal === "Aktif";
              const booked = Boolean(slot.no_reservasi);
              return (
                <div
                  key={slot.id_jadwal}
                  className={cx(
                    "flex w-full min-h-[86px] items-center justify-between rounded-[14px] border p-[17px] sm:w-[250px]",
                    booked
                      ? "border-[#eadcb6] bg-[#f6eedb]"
                      : active
                        ? "border-[#cdd9cf] bg-[#fbfdfb]"
                        : "border-[#ece7df] bg-[#f5f3ef]",
                  )}
                >
                  <div className='flex flex-col gap-[5px]'>
                    <p
                      className={cx(
                        "font-serif text-[22px]",
                        active || booked ? "text-[#3d4940]" : "text-[#a3a3a3]",
                      )}
                    >
                      {time(slot.jam_mulai)}
                    </p>
                    <p className='text-[11px] text-[#747873]'>
                      {time(slot.jam_mulai)} – {time(slot.jam_selesai)}
                    </p>
                  </div>
                  {booked ? (
                    <span className='flex min-h-[28px] items-center justify-center rounded-full bg-[#ead9ae] px-[10px] text-[10px] font-bold tracking-[0.2px] text-[#765d21]'>
                      DIPESAN
                    </span>
                  ) : (
                    <Toggle
                      checked={active}
                      disabled={busy === String(slot.id_jadwal)}
                      label={`Slot ${time(slot.jam_mulai)}`}
                      onChange={() => toggleSlot(slot)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className='rounded-[12px] bg-[#f6eedb] px-4 py-[15px] text-[12px] leading-[1.6] text-[#6c5a2e]'>
          <span className='font-bold'>Catatan:</span> Slot yang sudah dipesan
          tidak dapat dinonaktifkan. Perubahan slot lain disimpan otomatis.
        </div>

        <div className='h-[22px]' />

        <div className='flex items-center justify-end gap-[10px] border-t border-[#ece7df] pt-5'>
          <button
            onClick={load}
            disabled={loading || Boolean(busy)}
            className='flex h-11 items-center justify-center rounded-[999px] border border-[#ece7df] bg-white px-[18px] text-[13px] font-bold text-[#3d4940] transition-colors hover:bg-[#f5f5f3] disabled:cursor-not-allowed disabled:opacity-50'
          >
            Muat Ulang
          </button>
        </div>
      </div>

      {batchStatus && (
        <Modal
          icon={<span className='text-xl font-bold'>!</span>}
          iconTone={batchStatus === "Nonaktif" ? "red" : "brand"}
          title={`${batchStatus === "Nonaktif" ? "Nonaktifkan" : "Aktifkan"} Semua Slot`}
          subtitle={`Tindakan ini mengubah seluruh slot yang belum dipesan pada ${selectedDate}.`}
          onClose={() => setBatchStatus(null)}
          footer={
            <>
              <Button variant='outline' onClick={() => setBatchStatus(null)}>
                Batal
              </Button>
              <Button
                variant={batchStatus === "Nonaktif" ? "danger" : "primary"}
                disabled={busy === "batch"}
                onClick={confirmBatch}
              >
                Konfirmasi
              </Button>
            </>
          }
        >
          <p className='text-sm text-[#434655]'>
            Slot yang sudah dipesan tetap terkunci agar reservasi pasien aman.
          </p>
        </Modal>
      )}
    </div>
  );
}
