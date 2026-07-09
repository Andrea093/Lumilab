import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MRU from "./pages/MRU";
import MRUA from "./pages/MRUA";
import MCU from "./pages/MCU";
import MCUA from "./pages/MCUA";
import CaidaLibre from "./pages/CaidaLibre";
import Ondas from "./pages/Ondas";
import TopicLesson from "./pages/TopicLesson";
import ProtectedRoute from "./components/ProtectedRoute";
import LumiAssistant from "./components/LumiAssistant";
import SkipLink from "./components/SkipLink";

export default function App() {
  return (
    <BrowserRouter>
      <SkipLink />
      <Navbar />

      <main id="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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
            path="/tema/:slug"
            element={
              <ProtectedRoute>
                <TopicLesson />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <LumiAssistant />
    </BrowserRouter>
  );
}
