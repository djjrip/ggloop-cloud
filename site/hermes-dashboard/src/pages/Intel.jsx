import { motion } from 'framer-motion';
import { Radar, Flame, TrendingUp } from 'lucide-react';
import LiveFeed from '../components/LiveFeed';

function Stat({ Icon, label, value, accent }) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl px-5 py-4">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${accent}`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="text-[22px] font-extrabold leading-none tabular-nums">{value}</div>
        <div className="mt-1 text-[11px] text-zinc-500">{label}</div>
      </div>
    </div>
  );
}

export default function Intel({ leadsApi }) {
  const { leads, status, totalSeen, highValue } = leadsApi;
  const hotCount = leads.filter((l) => l.tier === 'HOT').length;

  return (
    <motion.div className="flex flex-col gap-[22px]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat Icon={Radar} label="Leads sniped (session)" value={totalSeen} accent="bg-brand/15 text-brand-hover" />
        <Stat Icon={Flame} label="Hot in current feed" value={hotCount} accent="bg-red-500/15 text-red-300" />
        <Stat Icon={TrendingUp} label="High-value (≥$5k MRR)" value={highValue} accent="bg-emerald-500/15 text-emerald-300" />
      </div>
      <LiveFeed leads={leads} status={status} expanded />
    </motion.div>
  );
}
