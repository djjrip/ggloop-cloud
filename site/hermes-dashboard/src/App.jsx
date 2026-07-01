import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AmbientBackground from './components/AmbientBackground';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import PaywallGate from './components/PaywallGate';
import Landing from './pages/Landing';
import Overview from './pages/Overview';
import AntiCheat from './pages/AntiCheat';
import Intel from './pages/Intel';
import Plugins from './pages/Plugins';
import Settings from './pages/Settings';
import { useLeads } from './hooks/useLeads';

const pageFade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 },
};

function DashboardLayout() {
  const leadsApi = useLeads();
  const location = useLocation();

  return (
    <PaywallGate>
      <div className="flex min-h-screen">
        <AmbientBackground />
        <Sidebar status={leadsApi.status} />

        <main className="flex min-w-0 flex-1 flex-col gap-[22px] p-4 md:p-[22px_28px_40px]">
          <Topbar
            status={leadsApi.status}
            paused={leadsApi.paused}
            onTogglePause={() => leadsApi.setPaused((p) => !p)}
          />

          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} {...pageFade} className="flex flex-1 flex-col gap-[22px]">
              <Routes location={location}>
                <Route path="/" element={<Overview leadsApi={leadsApi} />} />
                <Route path="/anti-cheat" element={<AntiCheat leadsApi={leadsApi} />} />
                <Route path="/intel" element={<Intel leadsApi={leadsApi} />} />
                <Route path="/plugins" element={<Plugins />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>

          <footer className="flex justify-between px-1 py-1.5 text-xs text-zinc-600">
            <span>© 2026 GG Loop — Hermes V2 Lead Engine</span>
            <span>
              {leadsApi.status === 'live'
                ? 'Live · localhost:3000'
                : leadsApi.status === 'offline'
                ? 'Broker offline · localhost:3000'
                : 'Connecting…'}
            </span>
          </footer>
        </main>
      </div>
    </PaywallGate>
  );
}

export default function App() {
  const location = useLocation();
  
  return (
    <Routes location={location}>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard/*" element={<DashboardLayout />} />
      <Route path="/success" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
