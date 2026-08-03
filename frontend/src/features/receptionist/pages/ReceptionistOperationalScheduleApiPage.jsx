import { useEffect, useMemo, useState } from "react";
import { Button, Card, Modal } from "../components/ui.jsx";
import {
  getReceptionistSchedules,
  setAllReceptionistScheduleStatus,
  setReceptionistScheduleStatus,
} from "../../../shared/services/receptionistApi.js";

const today = () => new Date().toISOString().slice(0, 10);
const time = (value) => value?.replace(":", ".") || "—";

export default function ReceptionistOperationalScheduleApiPage() {
  const [date, setDate] = useState(today);
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
      setSlots(await getReceptionistSchedules(date));
    } catch (requestError) {
      setSlots([]);
      setError(requestError.message || "Jadwal tidak dapat dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [date]);

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

  const toggle = async (slot) => {
    if (slot.no_reservasi) return;
    const status = slot.status_jadwal === "Aktif" ? "Nonaktif" : "Aktif";
    setBusy(String(slot.id_jadwal));
    setError("");
    try {
      const updated = await setReceptionistScheduleStatus(
        slot.id_jadwal,
        status,
      );
      setSlots((current) =>
        current.map((item) =>
          item.id_jadwal === updated.id_jadwal ? updated : item,
        ),
      );
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
        tanggal: date,
        status: batchStatus,
      });
      setSlots(result.data);
      setNotice(
        `${result.updated_count} slot diperbarui${result.skipped_booked_count ? `; ${result.skipped_booked_count} slot terpesan tetap terkunci.` : "."}`,
      );
      setBatchStatus(null);
    } catch (requestError) {
      setError(requestError.message || "Status jadwal tidak dapat diubah.");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <p className='text-[11px] font-bold uppercase tracking-[2px] text-[#b99b57]'>
          Pengaturan Operasional
        </p>
        <h1 className='mt-2 font-serif text-[36px] text-[#3d4940]'>
          Kelola Ketersediaan Jadwal
        </h1>
        <p className='mt-2 text-sm text-[#747873]'>
          Perubahan berlaku pada semua slot di tanggal yang dipilih.
        </p>
      </div>
      <Card pad='md'>
        <label className='block max-w-xs text-xs font-semibold text-[#434655]'>
          Tanggal jadwal
          <input
            type='date'
            value={date}
            onChange={(event) => {
              setNotice("");
              setDate(event.target.value);
            }}
            className='mt-1.5 h-10 w-full rounded-lg border border-[#e6e6e2] px-3 text-sm'
          />
        </label>
      </Card>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {[
          ["Slot Aktif", summary.active, "Dapat dipilih pasien"],
          ["Slot Nonaktif", summary.inactive, "Tidak tersedia"],
          ["Sudah Dipesan", summary.booked, "Tetap terkunci"],
        ].map(([label, value, note]) => (
          <Card key={label} pad='md'>
            <p className='text-xs text-[#434655]'>{label}</p>
            <p className='mt-1 text-3xl font-bold text-[#191c1e]'>{value}</p>
            <p className='mt-1 text-xs text-[#747873]'>{note}</p>
          </Card>
        ))}
      </div>
      <Card pad='md'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h2 className='font-bold text-[#191c1e]'>Slot 30 Menit</h2>
            <p className='mt-1 text-xs text-[#434655]'>
              Aksi massal tidak mengubah slot yang sudah dipesan.
            </p>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              disabled={!slots.length || busy === "batch"}
              onClick={() => setBatchStatus("Nonaktif")}
            >
              Nonaktifkan Semua
            </Button>
            <Button
              disabled={!slots.length || busy === "batch"}
              onClick={() => setBatchStatus("Aktif")}
            >
              Aktifkan Semua
            </Button>
          </div>
        </div>
        {error && (
          <p className='mt-4 rounded-lg bg-[#fdf1f1] px-3 py-2 text-sm text-[#a03d4a]'>
            {error}
          </p>
        )}
        {notice && (
          <p className='mt-4 rounded-lg bg-[#ebf0eb] px-3 py-2 text-sm text-[#3d4940]'>
            {notice}
          </p>
        )}
        {loading ? (
          <p className='py-10 text-center text-sm text-[#434655]'>
            Memuat jadwal…
          </p>
        ) : slots.length === 0 ? (
          <p className='py-10 text-center text-sm text-[#434655]'>
            Belum ada slot jadwal untuk tanggal ini.
          </p>
        ) : (
          <div className='mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {slots.map((slot) => {
              const booked = Boolean(slot.no_reservasi);
              const active = slot.status_jadwal === "Aktif";
              return (
                <div
                  key={slot.id_jadwal}
                  className={`flex items-center justify-between rounded-xl border p-4 ${booked ? "border-[#eadcb6] bg-[#fdf8eb]" : "border-[#e6e6e2]"}`}
                >
                  <div>
                    <p className='font-bold text-[#191c1e]'>
                      {time(slot.jam_mulai)} – {time(slot.jam_selesai)}
                    </p>
                    <p className='mt-1 text-xs text-[#434655]'>
                      {booked
                        ? `Dipesan: ${slot.no_reservasi}`
                        : active
                          ? "Aktif"
                          : "Nonaktif"}
                    </p>
                  </div>
                  <Button
                    variant={active ? "dangerSoft" : "soft"}
                    disabled={booked || busy === String(slot.id_jadwal)}
                    onClick={() => toggle(slot)}
                  >
                    {booked ? "Terkunci" : active ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
      {batchStatus && (
        <Modal
          icon={<span className='text-xl font-bold'>!</span>}
          iconTone={batchStatus === "Nonaktif" ? "red" : "brand"}
          title={`${batchStatus === "Nonaktif" ? "Nonaktifkan" : "Aktifkan"} Semua Slot`}
          subtitle={`Tindakan ini mengubah semua slot belum dipesan pada ${date}.`}
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
