import { motion } from 'framer-motion';

export default function LeadCard({ lead }) {
  const isReddit = lead.src === 'reddit';
  const isHot = lead.tier === 'HOT';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div
        className={`grid h-[38px] w-[38px] flex-shrink-0 place-items-center rounded-[11px] border text-[15px] font-extrabold ${
          isReddit
            ? 'border-orange-500/30 bg-orange-500/15 text-orange-400'
            : 'border-sky-400/30 bg-sky-400/15 text-sky-300'
        }`}
      >
        {isReddit ? 'r' : '𝕏'}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <span className="text-[13px] font-bold">{lead.handle}</span>
          <span className="truncate font-mono text-[11px] text-zinc-500">
            · {lead.where} · just now
          </span>
          <span className="ml-auto font-mono text-[11px] font-bold text-brand-hover">★ {lead.score}</span>
        </div>
        <div className="truncate text-[12.5px] text-zinc-400">&ldquo;{lead.intent}&rdquo;</div>
        <div className="mt-[7px] flex items-center gap-1.5">
          <span
            className={`rounded-md px-2 py-[3px] text-[10px] font-bold ${
              isHot ? 'bg-red-500/15 text-red-300' : 'bg-amber-500/15 text-amber-300'
            }`}
          >
            {lead.tier} LEAD
          </span>
          <span className="rounded-md bg-emerald-500/12 px-2 py-[3px] font-mono text-[10px] font-bold text-emerald-300">
            ~${lead.mrr}k MRR
          </span>
        </div>
      </div>
    </motion.div>
  );
}
