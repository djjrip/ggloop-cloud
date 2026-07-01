import { motion } from 'framer-motion';
import { ShieldCheck, ServerCog, Cpu, ArrowRight } from 'lucide-react';
import { STRIPE_CONFIG } from '../lib/config';
import AmbientBackground from '../components/AmbientBackground';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col font-sans overflow-hidden">
      <AmbientBackground />
      
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full z-10 relative">
        <div className="flex items-center gap-3">
          <span className="text-gradient text-3xl font-black leading-none">∞</span>
          <span className="text-xl font-extrabold tracking-tight">GG Loop</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
          <a href="#docs" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Docs</a>
          <a href={STRIPE_CONFIG.SUCCESS_URL.replace('/success', '/#pricing')} className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-sm font-bold transition-all border border-white/5">
            Login
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 relative mt-20 mb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold mb-8 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
            Hermes V2 Now Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
            Stop hackers. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-purple-500 to-brand-hover">
              Save your playerbase.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 font-medium">
            The zero-dependency TypeScript SDK that instantly detects memory injection, aimbots, and tampering. Drop it in your game and watch the bans roll into your live dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a 
              href={STRIPE_CONFIG.SUCCESS_URL.replace('/success', '/#pricing')}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand hover:bg-brand-hover text-black font-black text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(99,102,241,0.4)]"
            >
              Get Founding Member ($29/mo)
              <ArrowRight size={20} className="stroke-[3]" />
            </a>
            <a 
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg transition-all"
            >
              View Live Demo
            </a>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mt-32"
        >
          <div className="glass p-8 rounded-[24px] text-left border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 grid place-items-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Kernel-Level Telemetry</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Detects CheatEngine, memory tamplers, and unauthorized code injection instantly. We stream the violation signatures directly to your dashboard.
            </p>
          </div>
          
          <div className="glass p-8 rounded-[24px] text-left border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand grid place-items-center mb-6">
              <ServerCog size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Live Spreadsheets</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Watch hackers get banned in real-time. Our WebSocket-powered dashboard gives you a God-view of your entire server ecosystem without refreshing.
            </p>
          </div>

          <div className="glass p-8 rounded-[24px] text-left border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 grid place-items-center mb-6">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">0-Dependency SDK</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Generate an API key and drop the TypeScript snippet into your game client. Zero heavy dependencies. Zero impact on game performance.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
