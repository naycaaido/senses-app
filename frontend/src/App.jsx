import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import PatientLayout from "./layouts/PatientLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ServiceCatalogPage from "./pages/ServiceCatalogPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import BiodataPage from "./pages/BiodataPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PatientDashboardPage from "./pages/patient/PatientDashboardPage.jsx";
import PatientServicePage from "./pages/patient/PatientServicePage.jsx";
import PatientReservationPage from "./pages/patient/PatientReservationPage.jsx";
import PatientBookingProofPage from "./pages/patient/PatientBookingProofPage.jsx";
import PatientHistoryPage from "./pages/patient/PatientHistoryPage.jsx";
import PatientProfilePage from "./pages/patient/PatientProfilePage.jsx";
import PatientEditProfilePage from "./pages/patient/PatientEditProfilePage.jsx";
import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/layanan" element={<ServiceCatalogPage />} />
        </Route>
        <Route element={<PatientLayout />}>
          <Route path="/pasien/dashboard" element={<PatientDashboardPage />} />
          <Route path="/pasien/layanan" element={<PatientServicePage />} />
          <Route path="/pasien/reservasi" element={<PatientReservationPage />} />
          <Route path="/pasien/bukti-booking" element={<PatientBookingProofPage />} />
          <Route path="/pasien/riwayat" element={<PatientHistoryPage />} />
          <Route path="/pasien/profil" element={<PatientProfilePage />} />
          <Route
            path="/pasien/profil/ubah"
            element={<PatientEditProfilePage />}
          />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/lengkapi-biodata" element={<BiodataPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
