import { AnimatePresence } from 'framer-motion';
import LeadCard from './LeadCard';

export default function LiveFeed({ leads, status }) {
  return (
    <div className="glass flex h-full flex-col rounded-[22px] p-[22px_24px]">
      <div className="mb-[18px] flex items-start justify-between">
        <div>
          <h2 className="text-[17px] font-bold tracking-tight">Live Feed</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Incoming leads as Hermes detects them</p>
        </div>
        <span
          className={`inline-flex items-center gap-[7px] rounded-full border px-2.5 py-[5px] text-[11px] font-bold uppercase tracking-wide ${
            status === 'live'
              ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
              : 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300'
          }`}
        >
          <span className="h-[7px] w-[7px] animate-pulseSoft rounded-full bg-current" />
          {status === 'live' ? 'live · ws' : 'streaming'}
        </span>
      </div>

      <div className="flex max-h-[440px] flex-col gap-2.5 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
