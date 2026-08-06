import { Navigate, Routes, Route } from "react-router-dom";
import PublicLayout from "../features/public/layouts/PublicLayout.jsx";
import PatientLayout from "../features/patient/layouts/PatientLayout.jsx";
import ProtectedRoute from "../shared/components/auth/ProtectedRoute.jsx";
import LandingPage from "../features/public/pages/LandingPage.jsx";
import ServiceCatalogPage from "../features/public/pages/ServiceCatalogPage.jsx";
import LoginPage from "../features/public/pages/LoginPage.jsx";
import RegisterPage from "../features/public/pages/RegisterPage.jsx";
import BiodataPage from "../features/public/pages/BiodataPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PatientDashboardPage from "../features/patient/pages/PatientDashboardApiPage.jsx";
import PatientNoActiveReservationPreviewPage from "../features/patient/pages/PatientNoActiveReservationPreviewPage.jsx";
import PatientServicePage from "../features/patient/pages/PatientServicePage.jsx";
import PatientReservationPage from "../features/patient/pages/PatientReservationPage.jsx";
import PatientBookingProofPage from "../features/patient/pages/PatientBookingProofPage.jsx";
import PatientHistoryPage from "../features/patient/pages/PatientHistoryPage.jsx";
import PatientProfilePage from "../features/patient/pages/PatientProfilePage.jsx";
import PatientEditProfilePage from "../features/patient/pages/PatientEditProfilePage.jsx";
import ReceptionistLayout from "../features/receptionist/components/ReceptionistLayout.jsx";
import ReceptionistDashboardPage from "../features/receptionist/pages/ReceptionistDashboardApiPage.jsx";
import ReceptionistReservationPage from "../features/receptionist/pages/ReceptionistReservationApiPage.jsx";
import ReceptionistNewReservationPage from "../features/receptionist/pages/ReceptionistNewReservationApiPage.jsx";
import ReceptionistReservationDetailPage from "../features/receptionist/pages/ReceptionistReservationDetailApiPage.jsx";
import ReceptionistPatientDataPage from "../features/receptionist/pages/ReceptionistPatientDataApiPage.jsx";
import ReceptionistPatientRegistrationPage from "../features/receptionist/pages/ReceptionistPatientRegistrationApiPage.jsx";
import ReceptionistPatientDetailPage from "../features/receptionist/pages/ReceptionistPatientDetailApiPage.jsx";
import ReceptionistOperationalSchedulePage from "../features/receptionist/pages/ReceptionistOperationalSchedulePage.jsx";
import ReceptionistOperationalScheduleApiPage from "../features/receptionist/pages/ReceptionistOperationalScheduleApiPage.jsx";
import ReceptionistServicePage from "../features/receptionist/pages/ReceptionistServiceApiPage.jsx";
import ReceptionistServiceFormPage from "../features/receptionist/pages/ReceptionistServiceFormApiPage.jsx";
import ReceptionistPaymentPage from "../features/receptionist/pages/ReceptionistPaymentApiPage.jsx";
import ReceptionistPlaceholderPage from "../features/receptionist/pages/ReceptionistPlaceholderPage.jsx";
import ReceptionistLoginPage from "../features/receptionist/pages/ReceptionistLoginPage.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path='/' element={<LandingPage />} />
        <Route path='/layanan' element={<ServiceCatalogPage />} />
      </Route>
      <Route
        element={
          <ProtectedRoute allowedRoles={["pasien"]}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route path='/pasien/beranda' element={<PatientDashboardPage />} />
        <Route
          path='/pasien/beranda/tanpa-reservasi'
          element={<PatientNoActiveReservationPreviewPage />}
        />
        <Route path='/pasien/layanan' element={<PatientServicePage />} />
        <Route path='/pasien/reservasi' element={<PatientReservationPage />} />
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
      <Route path='/resepsionis/login' element={<ReceptionistLoginPage />} />
      <Route
        path='/resepsionis'
        element={
          <ProtectedRoute allowedRoles={["resepsionis"]}>
            <ReceptionistLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to='dashboard' replace />} />
        <Route path='dashboard' element={<ReceptionistDashboardPage />} />
        <Route path='reservasi' element={<ReceptionistReservationPage />} />
        <Route
          path='reservasi/baru'
          element={<ReceptionistNewReservationPage />}
        />
        <Route
          path='reservasi/:id'
          element={<ReceptionistReservationDetailPage />}
        />
        <Route path='data-pasien' element={<ReceptionistPatientDataPage />} />
        <Route
          path='data-pasien/baru'
          element={<ReceptionistPatientRegistrationPage />}
        />
        <Route
          path='data-pasien/:id'
          element={<ReceptionistPatientDetailPage />}
        />
        <Route
          path='data-pasien/:id/edit'
          element={<ReceptionistPatientRegistrationPage />}
        />
        <Route
          path='jadwal'
          element={<ReceptionistOperationalSchedulePage />}
        />
        <Route
          path='jadwal/api'
          element={<ReceptionistOperationalScheduleApiPage />}
        />
        <Route path='layanan' element={<ReceptionistServicePage />} />
        <Route path='layanan/baru' element={<ReceptionistServiceFormPage />} />
        <Route
          path='layanan/:id/edit'
          element={<ReceptionistServiceFormPage />}
        />
        <Route path='pembayaran' element={<ReceptionistPaymentPage />} />
        <Route path='*' element={<Navigate to='dashboard' replace />} />
      </Route>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route
        path='/lengkapi-biodata'
        element={
          <ProtectedRoute allowedRoles={["pasien"]}>
            <BiodataPage />
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}
