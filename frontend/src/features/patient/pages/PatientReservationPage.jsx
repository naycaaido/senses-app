import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DateSelector from "../components/DateSelector.jsx";
import TimeSlotGrid from "../components/TimeSlotGrid.jsx";
import ReservationSummary from "../components/ReservationSummary.jsx";
import mockServices from "../../../shared/data/services.js";

const doctor = {
  name: "dr. Ria Vista Sari, SpDV",
  specialization: "Spesialis Dermatologi & Venereologi",
};

const reservationDates = [
  { id: "06-jul", date: "06 Jul", day: "HARI INI" },
  { id: "07-jul", date: "07 Jul", day: "Rabu" },
  { id: "08-jul", date: "08 Jul", day: "Kamis" },
  { id: "09-jul", date: "09 Jul", day: "Jumat" },
  { id: "10-jul", date: "10 Jul", day: "Sabtu" },
];

const timeSlots = [
  { time: "9:00", available: false },
  { time: "9:30", available: false },
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: true },
  { time: "11:30", available: true },
];

export default function PatientReservationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedServiceId = searchParams.get("layanan");

  const selectedService =
    mockServices.find((service) => service.id === selectedServiceId) ??
    mockServices[0];

  const [selectedDateId, setSelectedDateId] = useState(reservationDates[0].id);
  const [selectedTime, setSelectedTime] = useState(null);

  const selectedDate =
    reservationDates.find((d) => d.id === selectedDateId) || null;
  const canContinue = Boolean(selectedDate && selectedTime);

  const handleContinue = () => {
    if (canContinue) {
      navigate("/pasien/bukti-booking");
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6">
      <header>
        <h1 className="m-0 font-serif text-[28px] font-bold leading-[34px] text-[#3d4940] md:text-[40px] md:leading-[46px]">Reservasi</h1>
        <p className="mt-1 text-[15px] leading-6 text-[#6b6b6b]">
          Bersama dr. Ria Vista Sari, SpDV. Pilih layanan, tanggal, lalu jam yang
          sesuai.
        </p>
      </header>

      <div className="mt-6 flex flex-col items-start gap-2.5 min-[1025px]:flex-row">
        <div className="min-w-0 flex-1 self-stretch rounded-2xl border border-[#f0ede7] bg-white p-5 md:p-[25px]">
          <DateSelector
            dates={reservationDates}
            selectedId={selectedDateId}
            onSelect={setSelectedDateId}
          />

          <TimeSlotGrid
            slots={timeSlots}
            selectedTime={selectedTime}
            onSelect={setSelectedTime}
          />

          <div className="mt-8 flex items-center justify-between border-t border-[#f0ede7] pt-[21px]">
            <Link to="/pasien/layanan" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-medium leading-6 text-[#6b6b6b] hover:bg-black/5">
              <img
                src="/assets/icon-arrow-left.svg"
                alt=""
                className="size-[16.5px] shrink-0"
                aria-hidden="true"
              />
              Kembali
            </Link>

            <button
              type="button"
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-medium leading-6 ${canContinue ? "bg-[#3d4940] text-[#fbf8f3] hover:bg-[#0c3320]" : "cursor-not-allowed bg-[#d4d4d4] text-[#6b6b6b]"}`}
              onClick={handleContinue}
              disabled={!canContinue}
            >
              Lanjut
              <img
                src="/assets/icon-arrow-right.svg"
                alt=""
                className="size-[16.5px] shrink-0"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <ReservationSummary
          doctor={doctor}
          service={selectedService}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      </div>
    </div>
  );
}
