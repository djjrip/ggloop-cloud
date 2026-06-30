import KpiStrip from '../components/KpiStrip';
import LiveFeed from '../components/LiveFeed';
import ConversionStats from '../components/ConversionStats';

export default function Overview({ leadsApi }) {
  const { leads, status, totalSeen, highValue } = leadsApi;
  return (
    <div className="flex flex-col gap-[22px]">
      <KpiStrip totalSeen={totalSeen} highValue={highValue} />
      <section className="grid grid-cols-1 gap-[22px] lg:grid-cols-[1.05fr_0.95fr]">
        <LiveFeed leads={leads} status={status} />
        <ConversionStats totalSeen={totalSeen} highValue={highValue} />
      </section>
    </div>
  );
}
