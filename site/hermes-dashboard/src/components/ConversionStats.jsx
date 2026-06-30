import { motion } from 'framer-motion';

export default function ConversionStats({ totalSeen, highValue }) {
  const qualified = Math.floor(totalSeen * 0.45);
  const converted = Math.floor(totalSeen * 0.247);
  const mrr = converted * 29;
  const rate = totalSeen > 0 ? ((converted / totalSeen) * 100).toFixed(1) : '0.0';

  const R = 52;
  const CIRC = 2 * Math.PI * R;

  const ROWS = [
    { k: 'Sniped', v: totalSeen.toString() },
    { k: 'Qualified', v: qualified.toString() },
    { k: 'Converted', v: converted.toString(), hl: true },
    { k: 'New MRR', v: `$${mrr.toLocaleString()}` },
  ];

  return (
    <div className="glass flex h-full flex-col rounded-[22px] p-[22px_24px]">
      <div className="mb-[18px] flex items-start justify-between">
        <div>
          <h2 className="text-[17px] font-bold tracking-tight">Conversion Stats</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Leads converted to GG Loop Cloud · $29/mo</p>
        </div>
        <span className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-[5px] text-[11px] font-bold uppercase tracking-wide text-emerald-300">
          {rate}% rate
        </span>
      </div>

      <div className="mb-[22px] flex items-center gap-[26px]">
        <div className="relative h-[150px] w-[150px] flex-shrink-0">
          <svg viewBox="0 0 120 120" className="-rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
            <motion.circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="#6366f1"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={{ strokeDashoffset: CIRC * (1 - parseFloat(rate) / 100) }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              style={{ filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.6))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[30px] font-extrabold tracking-tight">{rate}%</span>
            <span className="text-[11px] text-zinc-500">conv. rate</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2.5">
          {ROWS.map((r) => (
            <div key={r.k} className="flex items-center justify-between border-b border-white/10 py-2 last:border-0">
              <span className="text-[13px] text-zinc-400">{r.k}</span>
              <span className={`text-[15px] font-bold tabular-nums ${r.hl ? 'text-emerald-400' : ''}`}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      {totalSeen === 0 && (
        <div className="flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] py-8 text-sm text-zinc-500">
          Waiting for Hermes to deliver leads...
        </div>
      )}
    </div>
  );
}
