import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar.jsx";
import PublicFooter from "../components/PublicFooter.jsx";

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
