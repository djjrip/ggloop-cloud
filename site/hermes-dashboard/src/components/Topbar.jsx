import { motion } from 'framer-motion';

const STATUS_COPY = {
  live: { text: 'Live', cls: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300', dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]' },
  mock: { text: 'Demo', cls: 'border-amber-400/30 bg-amber-400/10 text-amber-300', dot: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' },
  connecting: { text: 'Connecting', cls: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300', dot: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' },
};

export default function Topbar({ status, paused, onTogglePause }) {
  const s = STATUS_COPY[status] || STATUS_COPY.connecting;
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass flex items-center justify-between rounded-[22px] p-[18px_24px]"
    >
      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight">Hermes Lead Engine</h1>
        <p className="mt-0.5 text-[13px] text-zinc-400">
          Sniping high-value B2B SaaS leads across Reddit &amp; Twitter
        </p>
      </div>
      <div className="flex items-center gap-3.5">
        <div className={`flex items-center gap-2 rounded-full border px-3.5 py-[7px] text-[13px] font-semibold ${s.cls}`}>
          <span className={`h-2 w-2 animate-pulseSoft rounded-full ${s.dot}`} />
          {paused ? 'Paused' : s.text}
        </div>
        <button
          onClick={onTogglePause}
          className="rounded-[10px] border border-white/15 bg-white/5 px-4 py-2 text-[13px] font-semibold text-white transition-all hover:-translate-y-px hover:bg-white/10"
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
        <div className="grid h-[38px] w-[38px] place-items-center rounded-full bg-gradient-to-br from-brand via-brand-violet to-[#a78bfa] text-[13px] font-bold text-white shadow-glow">
          JQ
        </div>
      </div>
    </motion.header>
  );
}
