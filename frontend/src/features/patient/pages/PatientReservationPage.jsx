import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DateSelector from "../components/DateSelector.jsx";
import TimeSlotGrid from "../components/TimeSlotGrid.jsx";
import ReservationSummary from "../components/ReservationSummary.jsx";
import { getActiveServices } from "../../../shared/services/layananApi.js";
import {
  createPatientReservation,
  getAvailableSchedules,
} from "../../../shared/services/reservasiApi.js";

const doctor = {
  name: "dr. Ria Vista Sari, SpDV",
  specialization: "Spesialis Dermatologi & Venereologi",
};

const dateLabelFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
});
const weekdayFormatter = new Intl.DateTimeFormat("id-ID", { weekday: "long" });

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const reservationDates = Array.from({ length: 5 }, (_, index) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + index);
  return {
    id: toDateKey(date),
    date: dateLabelFormatter.format(date),
    day: index === 0 ? "HARI INI" : weekdayFormatter.format(date).toUpperCase(),
  };
});

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function scheduleStartTimestampWib(date, time) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(time || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "") || !match) return Number.NaN;
  const [, hours, minutes, seconds = "00"] = match;
  return new Date(`${date}T${hours}:${minutes}:${seconds}+07:00`).getTime();
}

function isFutureSlot(date, time, now) {
  const startAt = scheduleStartTimestampWib(date, time);
  return Number.isFinite(startAt) && startAt > now;
}

function getConsecutiveSlots(slots, startTime, requiredCount, date, now) {
  const startIndex = slots.findIndex((slot) => slot.jam_mulai === startTime);
  if (startIndex < 0) return [];

  const selected = slots.slice(startIndex, startIndex + requiredCount);
  if (selected.length !== requiredCount) return [];

  const consecutive = selected.every((slot, index) => (
    index === 0 || timeToMinutes(slot.jam_mulai) - timeToMinutes(selected[index - 1].jam_mulai) === 30
  ));

  return consecutive && isFutureSlot(date, selected[0].jam_mulai, now) ? selected : [];
}

export default function PatientReservationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedServiceId = Number(searchParams.get("layanan"));
  const [selectedDateId, setSelectedDateId] = useState(reservationDates[0].id);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingService, setLoadingService] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [serviceError, setServiceError] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const selectedDate = reservationDates.find((date) => date.id === selectedDateId) || null;
  const requiredSlotCount = selectedService ? selectedService.durationMinutes / 30 : 0;
  const selectedSlots = useMemo(
    () => getConsecutiveSlots(slots, selectedTime, requiredSlotCount, selectedDateId, now),
    [now, requiredSlotCount, selectedDateId, selectedTime, slots],
  );
  const timeSlots = useMemo(
    () => slots.map((slot) => ({
      time: slot.jam_mulai,
      available: getConsecutiveSlots(
        slots,
        slot.jam_mulai,
        requiredSlotCount,
        selectedDateId,
        now,
      ).length === requiredSlotCount,
    })),
    [now, requiredSlotCount, selectedDateId, slots],
  );
  const canContinue = Boolean(selectedDate && selectedSlots.length === requiredSlotCount && !submitting);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingService(true);
    setServiceError("");

    getActiveServices()
      .then((services) => {
        const service = services.find((item) => item.id_layanan === selectedServiceId);
        if (!service) throw new Error("Layanan yang dipilih tidak tersedia.");
        if (active) setSelectedService(service);
      })
      .catch((error) => {
        if (active) setServiceError(error.message || "Layanan belum dapat dimuat.");
      })
      .finally(() => {
        if (active) setLoadingService(false);
      });

    return () => {
      active = false;
    };
  }, [selectedServiceId]);

  useEffect(() => {
    let active = true;
    setLoadingSchedule(true);
    setScheduleError("");
    setSelectedTime(null);

    getAvailableSchedules(selectedDateId)
      .then((data) => {
        if (active) setSlots(data);
      })
      .catch((error) => {
        if (active) setScheduleError(error.message || "Jadwal belum dapat dimuat.");
      })
      .finally(() => {
        if (active) setLoadingSchedule(false);
      });

    return () => {
      active = false;
    };
  }, [selectedDateId]);

  const refreshSchedules = async () => {
    setLoadingSchedule(true);
    setScheduleError("");
    setSelectedTime(null);
    try {
      setSlots(await getAvailableSchedules(selectedDateId));
    } catch (error) {
      setScheduleError(error.message || "Jadwal belum dapat dimuat ulang.");
    } finally {
      setLoadingSchedule(false);
      setNow(Date.now());
    }
  };

  const handleContinue = async () => {
    if (!selectedService || submitting) return;

    const selectedStart = selectedSlots[0] || slots.find((slot) => slot.jam_mulai === selectedTime);
    if (selectedStart && !isFutureSlot(selectedDateId, selectedStart.jam_mulai, Date.now())) {
      setBookingError("Jam yang dipilih sudah lewat atau tidak lagi tersedia. Silakan pilih jadwal lain.");
      await refreshSchedules();
      return;
    }
    if (!canContinue) return;

    setSubmitting(true);
    setBookingError("");
    try {
      const reservasi = await createPatientReservation({
        id_layanan: selectedService.id_layanan,
        id_jadwal: selectedSlots.map((slot) => slot.id_jadwal),
      });
      navigate(`/pasien/bukti-booking?reservasi=${encodeURIComponent(reservasi.no_reservasi)}`, { replace: true });
    } catch (error) {
      if (error.statusCode === 409) {
        setBookingError("Jam yang dipilih sudah lewat atau tidak lagi tersedia. Silakan pilih jadwal lain.");
        await refreshSchedules();
      } else {
        setBookingError(error.message || "Reservasi belum dapat dibuat. Silakan coba lagi.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingService) {
    return <p className="mx-auto max-w-[1200px] px-4 py-12 text-center text-[#6b6b6b]" role="status">Memuat layanan...</p>;
  }

  if (serviceError || !selectedService) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-12 text-center">
        <p className="text-[#8a3324]" role="alert">{serviceError || "Layanan tidak tersedia."}</p>
        <Link to="/pasien/layanan" className="inline-flex rounded-full bg-[#3d4940] px-5 py-2.5 text-sm font-medium text-[#fbf8f3] hover:bg-[#0c3320]">Kembali ke layanan</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6">
      <header>
        <h1 className="m-0 font-serif text-[28px] font-bold leading-[34px] text-[#3d4940] md:text-[40px] md:leading-[46px]">Reservasi</h1>
        <p className="mt-1 text-[15px] leading-6 text-[#6b6b6b]">
          Bersama dr. Ria Vista Sari, SpDV. Pilih layanan, tanggal, lalu jam yang sesuai.
        </p>
      </header>

      <div className="mt-6 flex flex-col items-start gap-2.5 min-[1025px]:flex-row">
        <div className="min-w-0 flex-1 self-stretch rounded-2xl border border-[#f0ede7] bg-white p-5 md:p-[25px]">
          <DateSelector dates={reservationDates} selectedId={selectedDateId} onSelect={setSelectedDateId} />

          {loadingSchedule && <p className="mt-6 text-[#6b6b6b]" role="status">Memuat jam tersedia...</p>}
          {!loadingSchedule && scheduleError && <p className="mt-6 text-[#8a3324]" role="alert">{scheduleError}</p>}
          {!loadingSchedule && !scheduleError && timeSlots.length === 0 && <p className="mt-6 text-[#6b6b6b]">Tidak ada jam tersedia pada tanggal ini.</p>}
          {!loadingSchedule && !scheduleError && timeSlots.length > 0 && (
            <TimeSlotGrid slots={timeSlots} selectedTime={selectedTime} onSelect={setSelectedTime} />
          )}
          {requiredSlotCount > 1 && !loadingSchedule && !scheduleError && (
            <p className="mt-3 text-sm text-[#6b6b6b]">Layanan ini memerlukan {requiredSlotCount} slot berurutan.</p>
          )}
          {bookingError && <p className="mt-6 rounded-xl bg-[#fff5f2] p-4 text-[#8a3324]" role="alert">{bookingError}</p>}

          <div className="mt-8 flex items-center justify-between border-t border-[#f0ede7] pt-[21px]">
            <Link to="/pasien/layanan" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-medium leading-6 text-[#6b6b6b] hover:bg-black/5">
              <img src="/assets/icon-arrow-left.svg" alt="" className="size-[16.5px] shrink-0" aria-hidden="true" />
              Kembali
            </Link>

            <button
              type="button"
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-medium leading-6 ${canContinue ? "bg-[#3d4940] text-[#fbf8f3] hover:bg-[#0c3320]" : "cursor-not-allowed bg-[#d4d4d4] text-[#6b6b6b]"}`}
              onClick={handleContinue}
              disabled={!canContinue}
            >
              {submitting ? "Membuat Reservasi..." : "Lanjut"}
              <img src="/assets/icon-arrow-right.svg" alt="" className="size-[16.5px] shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>

        <ReservationSummary doctor={doctor} service={selectedService} selectedDate={selectedDate} selectedTime={selectedTime} />
      </div>
    </div>
  );
}
