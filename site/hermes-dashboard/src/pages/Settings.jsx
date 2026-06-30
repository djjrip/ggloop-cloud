import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, CreditCard, Webhook, Copy, Check, RefreshCw, Crown, Lock } from 'lucide-react';
import { usePaid } from '../hooks/usePaid';
import { PRICING, STRIPE_CONFIG } from '../lib/config';

function Card({ Icon, title, desc, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-[22px] p-[22px_24px]"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-brand/25 bg-brand/12 text-brand-hover">
          <Icon size={18} />
        </div>
        <div>
          <h2 className="text-[16px] font-bold tracking-tight">{title}</h2>
          <p className="text-xs text-zinc-500">{desc}</p>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

function ApiKeyRow({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500">{label}</div>
        <code className="block truncate rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-[12px] text-zinc-300">
          {value}
        </code>
      </div>
      <button
        onClick={copy}
        className="mt-5 flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10"
      >
        {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export default function Settings() {
  const { isPaid, unlock, lock } = usePaid();
  const [webhook, setWebhook] = useState('');
  const [savedHook, setSavedHook] = useState(false);

  const saveWebhook = () => {
    try {
      localStorage.setItem('discordWebhook', webhook);
    } catch {
      /* ignore */
    }
    setSavedHook(true);
    setTimeout(() => setSavedHook(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 gap-[22px] xl:grid-cols-2">
      {/* API Keys */}
      <Card Icon={KeyRound} title="API Keys" desc="Authenticate the Hermes SDK & broker">
        <div className="flex flex-col gap-4">
          <ApiKeyRow label="Public key" value="ggl_pub_3f9c2a7e10b4d8f6" />
          <ApiKeyRow label="Secret key" value="ggl_sk_••••••••••••••••5c1d" />
          <button className="flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10">
            <RefreshCw size={14} /> Rotate secret key
          </button>
        </div>
      </Card>

      {/* Stripe Billing */}
      <Card Icon={CreditCard} title="Billing" desc="Stripe subscription & invoices">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Crown size={18} className={isPaid ? 'text-amber-300' : 'text-zinc-600'} />
              <div>
                <div className="text-sm font-bold">{PRICING.FOUNDING_MEMBER.label}</div>
                <div className="text-[11px] text-zinc-500">
                  ${PRICING.FOUNDING_MEMBER.price}{PRICING.FOUNDING_MEMBER.period} ·{' '}
                  {isPaid ? 'Active' : 'Not subscribed'}
                </div>
              </div>
            </div>
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                isPaid
                  ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                  : 'border-zinc-600/40 bg-zinc-600/10 text-zinc-400'
              }`}
            >
              {isPaid ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-mono text-[11px] text-zinc-500">
            price_id: {STRIPE_CONFIG.PRICE_ID || '— not configured —'}
          </div>

          {isPaid ? (
            <button
              onClick={lock}
              className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-300 transition-all hover:bg-red-500/15"
            >
              <Lock size={14} /> Cancel subscription (lock demo)
            </button>
          ) : (
            <button
              onClick={unlock}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand to-brand-violet px-4 py-2.5 text-xs font-bold text-white shadow-glow transition-all hover:-translate-y-0.5"
            >
              <Crown size={14} /> Activate demo access
            </button>
          )}
        </div>
      </Card>

      {/* Discord Webhooks */}
      <Card Icon={Webhook} title="Discord Webhooks" desc="Push HOT leads & bans to your server">
        <div className="flex flex-col gap-3">
          <input
            value={webhook}
            onChange={(e) => setWebhook(e.target.value)}
            placeholder="https://discord.com/api/webhooks/…"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3.5 py-2.5 font-mono text-[12px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-brand/50"
          />
          <button
            onClick={saveWebhook}
            disabled={!webhook}
            className="flex items-center justify-center gap-2 rounded-lg border border-brand/40 bg-brand/12 px-4 py-2.5 text-xs font-bold text-brand-hover transition-all hover:bg-brand hover:text-white disabled:opacity-50"
          >
            {savedHook ? <Check size={14} /> : <Webhook size={14} />}
            {savedHook ? 'Saved' : 'Save webhook'}
          </button>
        </div>
      </Card>

      {/* Broker */}
      <Card Icon={RefreshCw} title="Broker Connection" desc="Hermes V2 real-time engine">
        <div className="flex flex-col gap-2 font-mono text-[12px] text-zinc-400">
          <div className="flex justify-between border-b border-white/5 py-2">
            <span className="text-zinc-500">Socket URL</span>
            <span>localhost:3000</span>
          </div>
          <div className="flex justify-between border-b border-white/5 py-2">
            <span className="text-zinc-500">Checkout</span>
            <span>POST /api/checkout</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-zinc-500">Events</span>
            <span>new_lead · ban_event</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
