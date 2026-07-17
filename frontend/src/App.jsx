import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
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
import ReceptionistLayout from "./receptionist/components/ReceptionistLayout.jsx";
import { StoreProvider as ReceptionistStoreProvider } from "./receptionist/data/store.jsx";
import ReceptionistDashboardPage from "./receptionist/pages/ReceptionistDashboardPage.jsx";
import ReceptionistReservationPage from "./receptionist/pages/ReceptionistReservationPage.jsx";
import ReceptionistNewReservationPage from "./receptionist/pages/ReceptionistNewReservationPage.jsx";
import ReceptionistReservationDetailPage from "./receptionist/pages/ReceptionistReservationDetailPage.jsx";
import ReceptionistPatientDataPage from "./receptionist/pages/ReceptionistPatientDataPage.jsx";
import ReceptionistPatientRegistrationPage from "./receptionist/pages/ReceptionistPatientRegistrationPage.jsx";
import ReceptionistPatientDetailPage from "./receptionist/pages/ReceptionistPatientDetailPage.jsx";
import ReceptionistOperationalSchedulePage from "./receptionist/pages/ReceptionistOperationalSchedulePage.jsx";
import ReceptionistServicePage from "./receptionist/pages/ReceptionistServicePage.jsx";
import ReceptionistServiceFormPage from "./receptionist/pages/ReceptionistServiceFormPage.jsx";
import ReceptionistPlaceholderPage from "./receptionist/pages/ReceptionistPlaceholderPage.jsx";
import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path='/' element={<LandingPage />} />
          <Route path='/layanan' element={<ServiceCatalogPage />} />
        </Route>
        <Route element={<PatientLayout />}>
          <Route path='/pasien/beranda' element={<PatientDashboardPage />} />
          <Route path='/pasien/layanan' element={<PatientServicePage />} />
          <Route
            path='/pasien/reservasi'
            element={<PatientReservationPage />}
          />
          <Route
            path='/pasien/bukti-booking'
            element={<PatientBookingProofPage />}
          />
          <Route path='/pasien/riwayat' element={<PatientHistoryPage />} />
          <Route path='/pasien/profil' element={<PatientProfilePage />} />
          <Route
            path='/pasien/profil/ubah'
            element={<PatientEditProfilePage />}
          />
        </Route>
        <Route
          path="/resepsionis"
          element={
            <ReceptionistStoreProvider>
              <ReceptionistLayout />
            </ReceptionistStoreProvider>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ReceptionistDashboardPage />} />
          <Route path="reservasi" element={<ReceptionistReservationPage />} />
          <Route
            path="reservasi/baru"
            element={<ReceptionistNewReservationPage />}
          />
          <Route
            path="reservasi/:id"
            element={<ReceptionistReservationDetailPage />}
          />
          <Route path="data-pasien" element={<ReceptionistPatientDataPage />} />
          <Route
            path="data-pasien/baru"
            element={<ReceptionistPatientRegistrationPage />}
          />
          <Route
            path="data-pasien/:id"
            element={<ReceptionistPatientDetailPage />}
          />
          <Route
            path="data-pasien/:id/edit"
            element={<ReceptionistPatientRegistrationPage />}
          />
          <Route
            path="jadwal"
            element={<ReceptionistOperationalSchedulePage />}
          />
          <Route path="layanan" element={<ReceptionistServicePage />} />
          <Route
            path="layanan/baru"
            element={<ReceptionistServiceFormPage />}
          />
          <Route
            path="layanan/:id/edit"
            element={<ReceptionistServiceFormPage />}
          />
          <Route
            path="pembayaran"
            element={
              <ReceptionistPlaceholderPage
                title="Pembayaran"
                note="Halaman ini belum tersedia di design Figma (page Resepsionis Final), jadi belum diimplementasikan."
              />
            }
          />
          <Route
            path="keluar"
            element={
              <ReceptionistPlaceholderPage
                title="Keluar"
                note="Alur logout belum didesain di page Resepsionis Final."
              />
            }
          />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/lengkapi-biodata' element={<BiodataPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
