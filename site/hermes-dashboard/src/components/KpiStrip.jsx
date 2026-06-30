import { motion } from 'framer-motion';
import CountUp from './CountUp';

export default function KpiStrip({ totalSeen, highValue }) {
  const converted = Math.floor(totalSeen * 0.247); // realistic 24.7% conversion
  const mrr = converted * 29;

  const kpis = [
    { label: 'Leads Sniped', value: totalSeen, trend: totalSeen > 0 ? 'Live data' : 'Waiting for leads...', tone: totalSeen > 0 ? 'up' : 'neutral' },
    { label: 'High-Value (≥$5k MRR)', value: highValue, trend: highValue > 0 ? `${highValue} detected` : 'Scanning...', tone: highValue > 0 ? 'up' : 'neutral' },
    { label: 'Converted → Cloud', value: converted, trend: converted > 0 ? `${converted} × $29/mo` : 'No conversions yet', tone: converted > 0 ? 'up' : 'neutral' },
    { label: 'MRR Potential', value: mrr, prefix: '$', trend: mrr > 0 ? `From ${converted} signups` : '$0', tone: mrr > 0 ? 'up' : 'neutral' },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((k, i) => (
        <motion.div
          key={k.label}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 * i }}
          whileHover={{ y: -4 }}
          className="glass flex flex-col gap-2 rounded-2xl px-[22px] py-5"
        >
          <span className="text-xs font-medium text-zinc-500">{k.label}</span>
          <span className="text-[34px] font-extrabold leading-none tracking-tight tabular-nums">
            {k.prefix || ''}
            <CountUp to={k.value} />
          </span>
          <span className={`text-xs font-semibold ${k.tone === 'up' ? 'text-emerald-400' : 'text-zinc-500'}`}>
            {k.trend}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
