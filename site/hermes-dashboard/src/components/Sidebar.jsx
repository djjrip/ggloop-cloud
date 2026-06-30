import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ShieldCheck, Radar, Boxes, Settings as SettingsIcon } from 'lucide-react';

const NAV = [
  { to: '/', label: 'Overview', Icon: LayoutDashboard, end: true },
  { to: '/anti-cheat', label: 'Anti-Cheat', Icon: ShieldCheck },
  { to: '/intel', label: 'Lead Intel', Icon: Radar },
  { to: '/plugins', label: 'Plugin Store', Icon: Boxes },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon },
];

const STATUS = {
  live: { txt: 'Broker connected', dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]', chip: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' },
  offline: { txt: 'Broker offline', dot: 'bg-red-400 shadow-[0_0_8px_#f87171]', chip: 'border-red-400/30 bg-red-400/10 text-red-300' },
  connecting: { txt: 'Connecting…', dot: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]', chip: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300' },
};

export default function Sidebar({ status }) {
  const s = STATUS[status] || STATUS.connecting;
  return (
    <aside className="glass sticky top-0 hidden h-screen w-[248px] flex-shrink-0 flex-col gap-7 p-[26px_18px] md:flex">
      <div className="flex items-center gap-3 px-2">
        <span className="text-gradient text-3xl font-black leading-none">∞</span>
        <span className="text-[19px] font-extrabold tracking-tight">GG Loop</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="group relative flex items-center gap-3 rounded-[10px] px-3.5 py-[11px] text-sm font-medium text-zinc-400 transition-all hover:bg-white/5 hover:text-white aria-[current=page]:text-white"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="side-active"
                    className="absolute inset-0 -z-10 rounded-[10px] border border-brand/30 bg-gradient-to-br from-brand/25 to-brand-violet/10 shadow-[0_0_20px_rgba(99,102,241,0.18)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon size={17} className="opacity-85" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="glass-soft mt-auto rounded-2xl p-4">
        <div className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-bold ${s.chip}`}>
          <span className={`h-[7px] w-[7px] animate-pulseSoft rounded-full ${s.dot}`} />
          Hermes V2
        </div>
        <p className="mt-2.5 text-xs text-zinc-400">{s.txt}</p>
        <span className="font-mono text-[11px] text-zinc-500">localhost:3000 · ws</span>
      </div>
    </aside>
  );
}
