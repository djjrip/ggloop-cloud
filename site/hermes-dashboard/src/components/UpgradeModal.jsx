import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Loader2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { startCheckout } from '../lib/checkout';
import { PRICING } from '../lib/config';

const PERKS = [
  'Unlimited real-time Hermes lead intel',
  'Anti-cheat ban-log streaming & alerts',
  'Full Plugin Store + 70% rev-share payouts',
  'Stripe billing, API keys & Discord webhooks',
  'Founding Member badge — locked-in $29/mo forever',
];

export default function UpgradeModal({ onUnlock }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const subscribe = async () => {
    setBusy(true);
    setError('');
    try {
      await startCheckout(); // redirects to Stripe on success
    } catch (err) {
      setError(
        'Could not reach the billing service on localhost:3000. Start the backend, or use demo access below.'
      );
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 26 }}
        className="glass relative w-full max-w-[440px] overflow-hidden rounded-[26px] p-8"
      >
        {/* glow accents */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/30 blur-[70px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-brand-violet/25 blur-[70px]" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-hover">
            <Sparkles size={13} /> Founding Member
          </div>

          <h2 className="mt-4 text-[26px] font-extrabold leading-tight tracking-tight">
            Unlock <span className="text-gradient">GG Loop Cloud</span>
          </h2>
          <p className="mt-1.5 text-sm text-zinc-400">
            Live lead intel, anti-cheat security, and the plugin economy — in one command center.
          </p>

          <div className="mt-6 flex items-end gap-1.5">
            <span className="text-[52px] font-black leading-none tracking-tight">
              ${PRICING.FOUNDING_MEMBER.price}
            </span>
            <span className="mb-2 text-sm font-medium text-zinc-500">
              {PRICING.FOUNDING_MEMBER.period}
            </span>
            <span className="mb-2 ml-auto rounded-md bg-emerald-500/12 px-2 py-1 text-[11px] font-bold text-emerald-300">
              Locked-in forever
            </span>
          </div>

          <ul className="mt-6 flex flex-col gap-2.5">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[13px] text-zinc-300">
                <span className="mt-0.5 grid h-[18px] w-[18px] flex-shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-300">
                  <Check size={12} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <button
            onClick={subscribe}
            disabled={busy}
            className="group mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-violet px-5 py-3.5 text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(99,102,241,0.6)] disabled:translate-y-0 disabled:opacity-70"
          >
            {busy ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Redirecting to Stripe…
              </>
            ) : (
              <>
                <Zap size={16} /> Subscribe — ${PRICING.FOUNDING_MEMBER.price}/mo
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          {error && (
            <p className="mt-3 text-center text-[12px] leading-relaxed text-amber-300/90">{error}</p>
          )}

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
            <ShieldCheck size={13} /> Secure checkout powered by Stripe
          </div>

          {/* Dev/demo access so the dashboard is viewable without a live backend */}
          <button
            onClick={onUnlock}
            className="mt-5 w-full text-center text-[11px] text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-400 hover:underline"
          >
            Activate demo access (skip billing)
          </button>
        </div>
      </motion.div>
    </div>
  );
}
