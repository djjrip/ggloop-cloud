import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Radar, Copy, Check, Loader2 } from 'lucide-react';
import LeadCard from './LeadCard';
import { STRIPE_CONFIG } from '../lib/config';

const STATUS_CHIP = {
  live: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  offline: 'border-red-400/25 bg-red-400/10 text-red-300',
  connecting: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300',
};

export default function LiveFeed({ leads, status, expanded = false }) {
  const [pitchLead, setPitchLead] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const empty = leads.length === 0;

  const handleOpenPitch = (lead) => {
    setPitchLead(lead);
    setIsGenerating(true);
    // Simulate LLM generation delay (1.5 seconds)
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const generatePitch = (lead) => {
    if (!lead) return '';
    
    if (lead.tier === 'ENTERPRISE') {
      return `Subject: Executive Proposal: Custom Anti-Cheat Telemetry Gateway for ${lead.handle}\n\nDear VP of Game Engineering / Security at ${lead.handle},\n\nI noticed you are currently hiring specialized developers to build proprietary anti-cheat telemetry. Building anti-cheat in-house typically drains $200k+ in initial salaries and takes 6–9 months of core engineering time.\n\nAt GG Loop, we have built a zero-dependency security SDK that integrates into your game clients in under 15 minutes. It processes memory tampering, kernel modifications, and debugger hooks in real-time, streaming security signals directly to an encrypted dashboard.\n\nFor enterprise studios, we offer a Private Cloud Gateway hosted inside your own AWS VPC/infrastructure, protecting your player data while keeping integrations seamless.\n\nI would love to set up a 10-minute technical brief to share how our SDK can accelerate your security launch: http://ggloop-cloud-dashboard-jayson.s3-website-us-east-1.amazonaws.com\n\nSincerely,\nJayson Quindao\nFounder & CTO, GG Loop`;
    }

    return `Hey @${lead.handle},\n\nI saw your post about hackers ruining your game. It's an absolute nightmare when cheat kids destroy your player retention.\n\nI built GG Loop Anti-Cheat specifically to solve this for indie devs. It's a 0-dependency TypeScript SDK that instantly detects memory injection and fires alerts back to a live dashboard.\n\nWe just launched the Founding Member tier for $29/mo (no revenue scaling BS). Drop this into your game today and stop the bleeding: \n\n${STRIPE_CONFIG.SUCCESS_URL.replace('/success', '/#pricing')}\n\nLet me know if you need help with the SDK docs.`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePitch(pitchLead));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <LeadCard key={lead.id} lead={lead} onPitch={handleOpenPitch} />
            ))}
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
      {pitchLead && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl p-6 bg-[#0f0f11] border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {isGenerating && <Loader2 className="animate-spin text-brand w-5 h-5" />}
                {isGenerating ? 'Synthesizing outreach...' : `Generated Outreach for @${pitchLead.handle}`}
              </h3>
              <button onClick={() => setPitchLead(null)} className="text-zinc-500 hover:text-white transition-colors">✕</button>
            </div>
            
            <div className="p-4 bg-black/50 border border-white/5 rounded-xl min-h-[200px] flex flex-col">
              {isGenerating ? (
                <div className="flex-1 flex flex-col gap-3 justify-center">
                  <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-white/5 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse mt-4"></div>
                </div>
              ) : (
                <motion.pre 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed"
                >
                  {generatePitch(pitchLead)}
                </motion.pre>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button disabled={isGenerating} onClick={() => setPitchLead(null)} className="px-4 py-2 text-sm font-bold text-zinc-400 transition-all rounded-xl hover:bg-white/5 disabled:opacity-50">
                Discard
              </button>
              <button disabled={isGenerating} onClick={handleCopy} className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-black transition-all bg-brand rounded-xl hover:bg-brand-hover disabled:opacity-50 hover:scale-105 active:scale-95">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
