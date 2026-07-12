import { Outlet } from "react-router-dom";
import PatientHeader from "../components/layout/PatientHeader.jsx";
import "../styles/patient-layout.css";

export default function PatientLayout() {
  return (
    <>
      <PatientHeader />
      <main className="patient-layout__main">
        <Outlet />
      </main>
    </>
  );
}
