import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar.jsx";
import PublicFooter from "../components/layout/PublicFooter.jsx";
import "../styles/public-layout.css";

export default function PublicLayout() {
  return (
    <>
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}
