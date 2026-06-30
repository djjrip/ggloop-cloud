import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pause, Play, Wifi, WifiOff, Loader2 } from 'lucide-react';

const TITLES = {
  '/': { t: 'Overview', s: 'Real-time command center for GG Loop Cloud' },
  '/anti-cheat': { t: 'Anti-Cheat Security', s: 'Game server integrity & ban-log stream' },
  '/intel': { t: 'Hermes Lead Intel', s: 'Live B2B SaaS leads sniped from Reddit & X' },
  '/plugins': { t: 'Plugin Store', s: 'Open-Source Empire Hub · 70% rev-share' },
  '/settings': { t: 'Settings', s: 'API keys, Stripe billing & Discord webhooks' },
};

const STATUS = {
  live: { text: 'Live', Icon: Wifi, cls: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' },
  offline: { text: 'Offline', Icon: WifiOff, cls: 'border-red-400/30 bg-red-400/10 text-red-300' },
  connecting: { text: 'Connecting', Icon: Loader2, cls: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300' },
};

export default function Topbar({ status, paused, onTogglePause }) {
  const { pathname } = useLocation();
  const meta = TITLES[pathname] || TITLES['/'];
  const s = STATUS[status] || STATUS.connecting;
  const { Icon } = s;

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass flex items-center justify-between rounded-[22px] p-[18px_24px]"
    >
      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight">{meta.t}</h1>
        <p className="mt-0.5 text-[13px] text-zinc-400">{meta.s}</p>
      </div>
      <div className="flex items-center gap-3.5">
        <div className={`flex items-center gap-2 rounded-full border px-3.5 py-[7px] text-[13px] font-semibold ${s.cls}`}>
          <Icon size={14} className={status === 'connecting' ? 'animate-spin' : ''} />
          {paused ? 'Paused' : s.text}
        </div>
        <button
          onClick={onTogglePause}
          className="flex items-center gap-1.5 rounded-[10px] border border-white/15 bg-white/5 px-4 py-2 text-[13px] font-semibold text-white transition-all hover:-translate-y-px hover:bg-white/10"
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
          {paused ? 'Resume' : 'Pause'}
        </button>
        <div className="grid h-[38px] w-[38px] place-items-center rounded-full bg-gradient-to-br from-brand via-brand-violet to-[#a78bfa] text-[13px] font-bold text-white shadow-glow">
          JQ
        </div>
      </div>
    </motion.header>
  );
}
