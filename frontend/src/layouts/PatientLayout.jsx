import styles from "../styles/patient-layout.module.css";
import cx from "../utils/classNames.js";
import { Outlet } from "react-router-dom";
import PatientHeader from "../components/layout/PatientHeader.jsx";

export default function PatientLayout() {
  return (
    <>
      <PatientHeader />
      <main className={cx(styles, "patient-layout__main")}>
        <Outlet />
      </main>
    </>
  );
}
