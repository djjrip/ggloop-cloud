export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-28 -top-40 h-[520px] w-[520px] animate-drift rounded-full bg-[radial-gradient(circle,#6366f1,transparent_70%)] opacity-50 blur-[90px]" />
      <div className="absolute -bottom-44 -right-24 h-[460px] w-[460px] animate-drift-rev rounded-full bg-[radial-gradient(circle,#8b5cf6,transparent_70%)] opacity-50 blur-[90px]" />
      <div className="absolute left-[55%] top-[40%] h-[380px] w-[380px] animate-drift rounded-full bg-[radial-gradient(circle,#22d3ee,transparent_70%)] opacity-25 blur-[90px]" />
      <div
        className="absolute inset-0 opacity-[0.6]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 100% 80% at 50% 0%, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 100% 80% at 50% 0%, black, transparent 80%)',
        }}
      />
    </div>
  );
}
