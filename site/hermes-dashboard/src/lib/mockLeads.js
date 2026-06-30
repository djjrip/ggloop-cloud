// Mock lead generator — used to seed the feed and as a fallback
// when the Hermes socket isn't reachable (e.g. CEO demo with no backend).

const HANDLES = [
  { src: 'reddit', handle: 'u/devops_dan', where: 'r/SaaS' },
  { src: 'twitter', handle: '@maya_builds', where: 'X' },
  { src: 'reddit', handle: 'u/startupSam', where: 'r/startups' },
  { src: 'twitter', handle: '@grace_scales', where: 'X' },
  { src: 'reddit', handle: 'u/indiehacker_jo', where: 'r/indiehackers' },
  { src: 'twitter', handle: '@theo_ships', where: 'X' },
  { src: 'reddit', handle: 'u/cto_kelsey', where: 'r/gamedev' },
  { src: 'twitter', handle: '@nadia_pm', where: 'X' },
  { src: 'reddit', handle: 'u/lonelyfounder', where: 'r/Entrepreneur' },
  { src: 'twitter', handle: '@raj_devtools', where: 'X' },
];

const INTENTS = [
  "looking for an anti-cheat SDK that won't tank our frame rate…",
  'anyone know a lightweight cheat detection lib? building a multiplayer FPS',
  'our players keep alt-tabbing to aimbots, need a focus tracker asap',
  'tired of paying $2k/mo for anti-cheat — open source options?',
  'shipping an indie shooter, need tamper detection on a budget',
  'webhook-based violation reporting would be a dream right now',
  'evaluating anti-cheat vendors for our Unity title this sprint',
  'self-hosted anti-cheat with a clean dashboard… does it exist?',
  'memory editor detection without kernel drivers — possible?',
  'we just hit 5k CCU and cheaters are everywhere, help',
];

let seq = 0;

export function makeMockLead() {
  const who = HANDLES[Math.floor(Math.random() * HANDLES.length)];
  const intent = INTENTS[Math.floor(Math.random() * INTENTS.length)];
  const hot = Math.random() < 0.4;
  const tier = hot ? 'HOT' : 'WARM';
  const mrr = hot ? 5 + Math.floor(Math.random() * 8) : 1 + Math.floor(Math.random() * 4);
  const score = (hot ? 82 : 60) + Math.floor(Math.random() * 17);
  return {
    id: `mock-${Date.now()}-${seq++}`,
    src: who.src,
    handle: who.handle,
    where: who.where,
    intent,
    tier,
    mrr, // in $k
    score,
    ts: Date.now(),
  };
}

// Normalize a lead coming off the wire into the shape the UI expects.
// The backend may send src as "Reddit"/"Twitter" and mrr in raw dollars.
export function normalizeLead(raw) {
  if (!raw || typeof raw !== 'object') return makeMockLead();
  const srcRaw = String(raw.src || raw.source || 'reddit').toLowerCase();
  const src = srcRaw.includes('red') ? 'reddit' : 'twitter';
  let mrr = raw.mrr ?? raw.estMrr ?? 0;
  if (mrr > 1000) mrr = mrr / 1000; // backend sends raw $, UI shows $k
  const tier = String(raw.tier || (mrr >= 5 ? 'HOT' : 'WARM')).toUpperCase().includes('HOT')
    ? 'HOT'
    : 'WARM';
  return {
    id: raw.id || `lead-${Date.now()}-${seq++}`,
    src,
    handle: raw.handle || raw.author || 'anon',
    where: raw.where || raw.subreddit || raw.channel || (src === 'reddit' ? 'reddit' : 'X'),
    intent: raw.intent || raw.text || raw.body || '',
    tier,
    mrr: Math.max(1, Math.round(mrr * 10) / 10),
    score: raw.score ?? (tier === 'HOT' ? 88 : 64),
    ts: raw.ts || Date.now(),
  };
}
