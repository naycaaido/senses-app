import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DateSelector from "../../components/patient/DateSelector.jsx";
import TimeSlotGrid from "../../components/patient/TimeSlotGrid.jsx";
import ReservationSummary from "../../components/patient/ReservationSummary.jsx";
import mockServices from "../../mocks/services.js";
import "../../styles/patient-reservation.css";

const selectedService = mockServices[0];

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
    <div className="patient-reservation__inner">
      <header className="patient-reservation__header">
        <h1 className="patient-reservation__title">Reservasi</h1>
        <p className="patient-reservation__desc">
          Bersama dr. Ria Vista Sari, SpDV. Pilih layanan, tanggal, lalu jam yang
          sesuai.
        </p>
      </header>

      <div className="patient-reservation__layout">
        <div className="reservation-card">
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

          <div className="reservation-actions">
            <Link to="/pasien/layanan" className="btn-back">
              <img
                src="/assets/icon-arrow-left.svg"
                alt=""
                className="btn-back__icon"
                aria-hidden="true"
              />
              Kembali
            </Link>

            <button
              type="button"
              className="btn-continue"
              onClick={handleContinue}
              disabled={!canContinue}
            >
              Lanjut
              <img
                src="/assets/icon-arrow-right.svg"
                alt=""
                className="btn-continue__icon"
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
