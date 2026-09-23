import { Routes, Route, Link } from "react-router-dom";
import { useLang } from "./lib/i18n.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import Search from "./pages/Search.jsx";
import Data from "./pages/Data.jsx";
import FacilityDetail from "./pages/FacilityDetail.jsx";
import ReportNew from "./pages/ReportNew.jsx";
import ReportSuccess from "./pages/ReportSuccess.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import AdminQueue from "./pages/admin/AdminQueue.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import PersonalDetails from "./pages/profile/PersonalDetails.jsx";
import ChangePassword from "./pages/profile/ChangePassword.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

export default function App() {
  const { t } = useLang();
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/data" element={<Data />} />
          <Route path="/facility/:id" element={<FacilityDetail />} />
          <Route path="/report/new" element={<ReportNew />} />
          <Route path="/report/success" element={<ReportSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<RequireAuth><PersonalDetails /></RequireAuth>} />
          <Route path="/profile/password" element={<RequireAuth><ChangePassword /></RequireAuth>} />
          <Route path="/admin" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
          <Route path="/admin/queue" element={<RequireAdmin><AdminQueue /></RequireAdmin>} />
        </Routes>
      </main>
      <Footer />
      <Link
        to="/report/new"
        className="btn-primary fixed bottom-8 right-6 sm:bottom-10 sm:right-8 z-30 shadow-xl rounded-full px-5 py-3"
      >
        {t("common.shareExperience")}
      </Link>
    </>
  );
}
