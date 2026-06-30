import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ServerCog, Ban, Clock } from 'lucide-react';
import { useBanEvents } from '../hooks/useBanEvents';

function StatCard({ Icon, label, value, accent, sub }) {
  return (
    <div className="glass flex items-center gap-3.5 rounded-2xl px-5 py-4">
      <div className={`grid h-11 w-11 place-items-center rounded-xl ${accent}`}>
        <Icon size={19} />
      </div>
      <div>
        <div className="text-[24px] font-extrabold leading-none tabular-nums">{value}</div>
        <div className="mt-1 text-[11px] text-zinc-500">{label}</div>
      </div>
      {sub && <span className="ml-auto self-start text-[11px] text-zinc-600">{sub}</span>}
    </div>
  );
}

function timeAgo(ts) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export default function AntiCheat() {
  const { events, status } = useBanEvents();
  const bans = events.filter((e) => e.action === 'BAN').length;

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          Icon={ShieldCheck}
          label="Broker status"
          value={status === 'live' ? 'Online' : status === 'offline' ? 'Offline' : '…'}
          accent={status === 'live' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}
        />
        <StatCard Icon={Ban} label="Bans this session" value={bans} accent="bg-red-500/15 text-red-300" />
        <StatCard Icon={ServerCog} label="Events streamed" value={events.length} accent="bg-brand/15 text-brand-hover" />
      </div>

      <div className="glass rounded-[22px] p-[22px_24px]">
        <div className="mb-[18px] flex items-start justify-between">
          <div>
            <h2 className="text-[17px] font-bold tracking-tight">Ban Log</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Live integrity violations streamed from your game servers
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-[7px] rounded-full border px-2.5 py-[5px] text-[11px] font-bold uppercase tracking-wide ${
              status === 'live'
                ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
                : status === 'offline'
                ? 'border-red-400/25 bg-red-400/10 text-red-300'
                : 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300'
            }`}
          >
            <span className="h-[7px] w-[7px] animate-pulseSoft rounded-full bg-current" />
            {status === 'live' ? 'live · ws' : status === 'offline' ? 'offline' : 'connecting'}
          </span>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] py-16 text-center">
            <ShieldAlert size={28} className="text-zinc-600" />
            <p className="text-sm text-zinc-500">
              {status === 'offline'
                ? 'Broker offline — start server.js on localhost:3000 to stream ban events.'
                : 'No violations detected. Ban events will appear here in real time.'}
            </p>
          </div>
        ) : (
          <div className="flex max-h-[calc(100vh-340px)] flex-col gap-2.5 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {events.map((e) => (
                <motion.div
                  key={e.id}
                  layout
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5"
                >
                  <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px] border border-red-500/30 bg-red-500/15 text-red-300">
                    <Ban size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold">{e.player}</span>
                      <span className="font-mono text-[11px] text-zinc-500">· {e.server}</span>
                      <span className="ml-auto flex items-center gap-1 font-mono text-[11px] text-zinc-500">
                        <Clock size={11} /> {timeAgo(e.ts)}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-[12.5px] text-zinc-400">{e.reason}</div>
                  </div>
                  <span className="rounded-md bg-red-500/15 px-2 py-1 text-[10px] font-bold text-red-300">
                    {e.action}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
