import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AmbientBackground from './components/AmbientBackground';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import KpiStrip from './components/KpiStrip';
import LiveFeed from './components/LiveFeed';
import ConversionStats from './components/ConversionStats';
import PluginStore from './components/PluginStore';
import { useLeads } from './hooks/useLeads';

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35 },
};

export default function App() {
  const { leads, status, paused, setPaused, totalSeen, highValue } = useLeads();
  const [tab, setTab] = useState('overview');

  return (
    <div className="flex min-h-screen">
      <AmbientBackground />
      <Sidebar active={tab} onSelect={setTab} status={status} />

      <main className="flex min-w-0 flex-1 flex-col gap-[22px] p-4 md:p-[22px_28px_40px]">
        <Topbar status={status} paused={paused} onTogglePause={() => setPaused((p) => !p)} />
        <KpiStrip totalSeen={totalSeen} highValue={highValue} />

        <AnimatePresence mode="wait">
          {tab === 'store' ? (
            <motion.div key="store" {...fade}>
              <PluginStore />
            </motion.div>
          ) : (
            <motion.div key="overview" {...fade} className="flex flex-col gap-[22px]">
              <section className="grid grid-cols-1 gap-[22px] lg:grid-cols-[1.05fr_0.95fr]">
                <LiveFeed leads={leads} status={status} />
                <ConversionStats totalSeen={totalSeen} highValue={highValue} />
              </section>
              <PluginStore />
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="flex justify-between px-1 py-1.5 text-xs text-zinc-600">
          <span>© 2026 GG Loop — Hermes V2 Lead Engine</span>
          <span>
            {status === 'live'
              ? 'Live · localhost:3000'
              : status === 'mock'
              ? 'Demo stream · backend offline'
              : 'Connecting…'}
          </span>
        </footer>
      </main>
    </div>
  );
}
