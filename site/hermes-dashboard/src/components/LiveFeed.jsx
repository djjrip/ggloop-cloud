import { AnimatePresence } from 'framer-motion';
import { Radar } from 'lucide-react';
import LeadCard from './LeadCard';

const STATUS_CHIP = {
  live: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  offline: 'border-red-400/25 bg-red-400/10 text-red-300',
  connecting: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300',
};

export default function LiveFeed({ leads, status, expanded = false }) {
  const empty = leads.length === 0;
  return (
    <div className="glass flex h-full flex-col rounded-[22px] p-[22px_24px]">
      <div className="mb-[18px] flex items-start justify-between">
        <div>
          <h2 className="text-[17px] font-bold tracking-tight">Live Feed</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Incoming leads as Hermes detects them</p>
        </div>
        <span
          className={`inline-flex items-center gap-[7px] rounded-full border px-2.5 py-[5px] text-[11px] font-bold uppercase tracking-wide ${
            STATUS_CHIP[status] || STATUS_CHIP.connecting
          }`}
        >
          <span className="h-[7px] w-[7px] animate-pulseSoft rounded-full bg-current" />
          {status === 'live' ? 'live · ws' : status === 'offline' ? 'offline' : 'connecting'}
        </span>
      </div>

      <div
        className={`flex flex-col gap-2.5 overflow-y-auto pr-1 ${
          expanded ? 'max-h-[calc(100vh-280px)]' : 'max-h-[440px]'
        }`}
      >
        {empty ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] py-14 text-center">
            <Radar size={26} className="animate-pulse text-zinc-600" />
            <p className="text-sm text-zinc-500">
              {status === 'offline'
                ? 'Hermes broker offline — start server.js on localhost:3000'
                : 'Waiting for Hermes to deliver the first lead…'}
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
