import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import OnboardingStory, { hasSeenOnboarding } from "./components/OnboardingStory";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Temas from "./pages/Temas";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminPanel from "./pages/AdminPanel";
import MRU from "./pages/MRU";
import MRUA from "./pages/MRUA";
import MCU from "./pages/MCU";
import MCUA from "./pages/MCUA";
import CaidaLibre from "./pages/CaidaLibre";
import Ondas from "./pages/Ondas";
import TopicLesson from "./pages/TopicLesson";
import Laboratorio from "./pages/Laboratorio";
import Nosotros from "./pages/Nosotros";
import Premium from "./pages/Premium";
import PagoResultado from "./pages/PagoResultado";
import ProtectedRoute from "./components/ProtectedRoute";
import LumiAssistant from "./components/LumiAssistant";
import SkipLink from "./components/SkipLink";

export default function App() {
  const { isAuthenticated } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(() => !hasSeenOnboarding());

  return (
    <BrowserRouter>
      <SkipLink />
      <Navbar />

      {isAuthenticated && showOnboarding && (
        <OnboardingStory onFinish={() => setShowOnboarding(false)} />
      )}

      <main id="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route
            path="/laboratorio"
            element={
              <ProtectedRoute>
                <Laboratorio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/temas"
            element={
              <ProtectedRoute>
                <Temas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mru"
            element={
              <ProtectedRoute>
                <MRU />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mrua"
            element={
              <ProtectedRoute>
                <MRUA />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mcu"
            element={
              <ProtectedRoute>
                <MCU />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mcua"
            element={
              <ProtectedRoute>
                <MCUA />
              </ProtectedRoute>
            }
          />
          <Route
            path="/caida-libre"
            element={
              <ProtectedRoute>
                <CaidaLibre />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ondas"
            element={
              <ProtectedRoute>
                <Ondas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/panel-docente"
            element={
              <ProtectedRoute roles={["teacher", "admin"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tema/:slug"
            element={
              <ProtectedRoute>
                <TopicLesson />
              </ProtectedRoute>
            }
          />
          <Route
            path="/premium"
            element={
              <ProtectedRoute>
                <Premium />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pago/resultado"
            element={
              <ProtectedRoute>
                <PagoResultado />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <LumiAssistant />
    </BrowserRouter>
  );
}
