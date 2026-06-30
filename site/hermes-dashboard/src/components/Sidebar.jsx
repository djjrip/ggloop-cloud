import { motion } from 'framer-motion';

const NAV = [
  { id: 'overview', label: 'Overview', icon: '◎' },
  { id: 'live', label: 'Live Feed', icon: '⚡' },
  { id: 'stats', label: 'Conversions', icon: '▤' },
  { id: 'store', label: 'Plugin Store', icon: '◳' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

export default function Sidebar({ active, onSelect, status }) {
  return (
    <aside className="glass sticky top-0 hidden h-screen w-[248px] flex-shrink-0 flex-col gap-7 p-[26px_18px] md:flex">
      <div className="flex items-center gap-3 px-2">
        <span className="text-gradient text-3xl font-black leading-none">∞</span>
        <span className="text-[19px] font-extrabold tracking-tight">GG Loop</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`relative flex items-center gap-3 rounded-[10px] px-3.5 py-[11px] text-left text-sm font-medium transition-all ${
                isActive ? 'text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="side-active"
                  className="absolute inset-0 -z-10 rounded-[10px] border border-brand/30 bg-gradient-to-br from-brand/25 to-brand-violet/10 shadow-[0_0_20px_rgba(99,102,241,0.18)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="w-[18px] text-center text-[15px] opacity-85">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="glass-soft mt-auto rounded-2xl p-4">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-bold ${
            status === 'live'
              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
              : status === 'mock'
              ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
              : 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300'
          }`}
        >
          <span
            className={`h-[7px] w-[7px] animate-pulseSoft rounded-full ${
              status === 'live'
                ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                : status === 'mock'
                ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
            }`}
          />
          Hermes V2
        </div>
        <p className="mt-2.5 text-xs text-zinc-400">
          {status === 'live'
            ? 'Broker connected'
            : status === 'mock'
            ? 'Demo stream (no broker)'
            : 'Connecting to broker…'}
        </p>
        <span className="font-mono text-[11px] text-zinc-500">localhost:3000 · ws</span>
      </div>
    </aside>
  );
}
