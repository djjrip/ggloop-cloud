import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ServerCog, Ban, Clock, KeyRound, Copy, Check } from 'lucide-react';
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

function timeString(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }) + '.' + d.getMilliseconds().toString().padStart(3, '0');
}

export default function AntiCheat() {
  const { events, status } = useBanEvents();
  const bans = events.filter((e) => e.action === 'BAN').length;
  
  const [apiKey, setApiKey] = useState(localStorage.getItem('ggloop_api_key') || null);
  const [copied, setCopied] = useState(false);

  const handleGenerateKey = () => {
    const newKey = 'GGLOOP_pk_live_' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('');
    localStorage.setItem('ggloop_api_key', newKey);
    setApiKey(newKey);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">SDK Telemetry</h1>
          <p className="mt-1 text-sm text-zinc-400">Live integrity feed from your connected game servers.</p>
        </div>
        
        {apiKey ? (
          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-1.5 pl-3">
            <span className="font-mono text-xs text-zinc-300 w-[240px] truncate">{apiKey}</span>
            <button 
              onClick={handleCopy}
              className="grid place-items-center h-8 w-8 rounded-lg bg-white/10 text-zinc-300 hover:bg-white/20 transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        ) : (
          <button 
            onClick={handleGenerateKey}
            className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-black transition-transform hover:scale-105 hover:bg-brand-hover active:scale-95"
          >
            <KeyRound size={16} />
            Generate API Key
          </button>
        )}
      </div>

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

      <div className="glass flex flex-col rounded-[22px] overflow-hidden">
        <div className="flex items-center justify-between p-[22px_24px] border-b border-white/5">
          <div>
            <h2 className="text-[17px] font-bold tracking-tight">Real-Time Detections</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Live spreadsheet of flagged accounts
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
          <div className="flex flex-col items-center justify-center gap-3 bg-white/[0.01] py-24 text-center">
            <ShieldAlert size={32} className="text-zinc-600 mb-2" />
            <p className="text-[15px] font-medium text-zinc-400">
              {status === 'offline'
                ? 'Broker offline — start server.js on localhost:3000 to stream events.'
                : 'No violations detected.'}
            </p>
            <p className="text-xs text-zinc-500">Events will populate this grid in real time.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-[13px]">
              <thead className="sticky top-0 z-10 bg-[#0f0f11]/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-6 py-3 border-b border-white/5 font-semibold">Timestamp</th>
                  <th className="px-6 py-3 border-b border-white/5 font-semibold">Player</th>
                  <th className="px-6 py-3 border-b border-white/5 font-semibold">Server Node</th>
                  <th className="px-6 py-3 border-b border-white/5 font-semibold">Violation Signature</th>
                  <th className="px-6 py-3 border-b border-white/5 font-semibold">Confidence</th>
                  <th className="px-6 py-3 border-b border-white/5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence initial={false}>
                  {events.map((e) => (
                    <motion.tr
                      key={e.id}
                      layout
                      initial={{ opacity: 0, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                      animate={{ opacity: 1, backgroundColor: 'transparent' }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="group transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="whitespace-nowrap px-6 py-3.5 font-mono text-zinc-400">
                        {timeString(e.ts)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3.5 font-bold text-white">
                        {e.player}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3.5 text-zinc-400">
                        {e.server}
                      </td>
                      <td className="px-6 py-3.5 text-red-200">
                        {e.reason}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                            <div 
                              className={`h-full rounded-full ${e.confidence > 95 ? 'bg-red-500' : 'bg-brand'}`} 
                              style={{ width: `${e.confidence || 99}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-zinc-400">{e.confidence || 99}%</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3.5 text-right">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold ${
                          e.action === 'BAN' ? 'bg-red-500/15 text-red-300' : 'bg-amber-500/15 text-amber-300'
                        }`}>
                          {e.action}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

