import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLUGINS } from '../data/plugins';

const FILTERS = ['All', 'Official', 'Community', 'AI', 'Installed'];

function matches(plugin, filter) {
  if (filter === 'All') return true;
  if (filter === 'Installed') return plugin.installed;
  return plugin.tags.includes(filter.toLowerCase());
}

function PluginCard({ plugin, installed, onInstall }) {
  const [busy, setBusy] = useState(false);
  const handle = () => {
    if (installed || busy) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      onInstall(plugin.id);
    }, 750);
  };
  return (
    <motion.div
      layout
      whileHover={{ y: -5 }}
      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-[18px] transition-colors hover:border-brand-violet/40 hover:shadow-glow-violet"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-[42px] w-[42px] place-items-center rounded-xl border border-brand-violet/25 bg-gradient-to-br from-brand/20 to-brand-violet/10 text-xl">
          {plugin.icon}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-bold">{plugin.name}</div>
          <div className="font-mono text-[11px] text-zinc-500">{plugin.author}</div>
        </div>
        {plugin.revShare && (
          <span className="ml-auto whitespace-nowrap rounded-md bg-emerald-500/12 px-2 py-1 text-[10px] font-bold text-emerald-300">
            {plugin.revShare}
          </span>
        )}
      </div>

      <p className="flex-1 text-[12.5px] leading-relaxed text-zinc-400">{plugin.desc}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-[11px] text-zinc-500">
          <span>★ {plugin.stars}</span>
          <span>↓ {plugin.downloads}</span>
          <span className="text-zinc-400">{plugin.price}</span>
        </div>
        <button
          onClick={handle}
          disabled={installed}
          className={`rounded-lg border px-3.5 py-1.5 text-xs font-bold transition-all ${
            installed
              ? 'cursor-default border-emerald-400/40 bg-emerald-500/14 text-emerald-300'
              : 'border-brand/40 bg-brand/12 text-brand-hover hover:bg-brand hover:text-white hover:shadow-glow'
          }`}
        >
          {installed ? '✓ Installed' : busy ? 'Installing…' : 'Install'}
        </button>
      </div>
    </motion.div>
  );
}

export default function PluginStore() {
  const [installed, setInstalled] = useState(
    () => new Set(PLUGINS.filter((p) => p.installed).map((p) => p.id))
  );
  const [filter, setFilter] = useState('All');

  const onInstall = (id) => setInstalled((prev) => new Set(prev).add(id));

  const visible = useMemo(
    () => PLUGINS.filter((p) => matches({ ...p, installed: installed.has(p.id) }, filter)),
    [filter, installed]
  );

  return (
    <div className="glass rounded-[22px] p-[22px_24px]">
      <div className="mb-[18px] flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-bold tracking-tight">Plugin Store</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            Open-Source Empire Hub — community plugins on a 70% rev-share
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition-all ${
                filter === f
                  ? 'border-brand/50 bg-brand/15 text-brand-hover'
                  : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <PluginCard
              key={p.id}
              plugin={p}
              installed={installed.has(p.id)}
              onInstall={onInstall}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
