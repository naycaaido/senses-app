import { Outlet } from "react-router-dom";
import PatientHeader from "../components/PatientHeader.jsx";

export default function PatientLayout() {
  return (
    <>
      <PatientHeader />
      <main className="min-h-screen bg-[#fbf8f3] pt-[105px] md:pt-[65px]">
        <Outlet />
      </main>
    </>
  );
}
