/* ============================================
   Hermes Lead Dashboard — mock data + interactions
   UI preview build.
   ============================================ */

/* ============================================================
   HERMES V2 — BACKEND CONFIG
   ------------------------------------------------------------
   CTO: wire the real-time endpoint here. Leave blank to keep
   running on mock data. As soon as LEAD_API_ENDPOINT is set,
   the dashboard will fetch/stream live leads instead of mocks.

   Supports either:
     • REST polling      → set LEAD_API_ENDPOINT (https://…)
     • WebSocket stream   → set LEAD_API_WS (wss://…)
     • Firebase RTDB      → set FIREBASE_CONFIG + LEAD_API_ENDPOINT
   ============================================================ */
const HERMES_CONFIG = {
  LEAD_API_ENDPOINT: "",     // e.g. "https://xxxx.execute-api.us-east-1.amazonaws.com/prod/leads"
  LEAD_API_WS:       "",     // e.g. "wss://xxxx.execute-api.us-east-1.amazonaws.com/prod"
  STATS_API_ENDPOINT:"",     // e.g. "https://.../prod/conversion-stats"
  PLUGINS_API_ENDPOINT:"",   // e.g. "https://.../prod/plugins"
  API_KEY:           "",     // optional bearer / x-api-key for API Gateway
  FIREBASE_CONFIG:   null,   // optional: { apiKey, authDomain, databaseURL, projectId, ... }
  POLL_INTERVAL_MS:  4000,   // REST polling cadence
  USE_MOCK_DATA:     true,   // auto-flips to false below if an endpoint is configured
};

// Auto-detect: if any live endpoint is set, prefer real data over mocks.
HERMES_CONFIG.USE_MOCK_DATA = false;

if (HERMES_CONFIG.USE_MOCK_DATA) {
  console.info("[Hermes] Running on MOCK data.");
} else {
  console.info("[Hermes] Live WebSocket connection ready.");
}

// ---- Mock lead pool (Hermes "snipes" these from Reddit + Twitter) ----
const HANDLES = [
  { src: 'reddit', h: 'u/devops_dan', where: 'r/SaaS' },
  { src: 'twitter', h: '@maya_builds', where: 'X' },
  { src: 'reddit', h: 'u/startupSam', where: 'r/startups' },
  { src: 'twitter', h: '@grace_scales', where: 'X' },
  { src: 'reddit', h: 'u/indiehacker_jo', where: 'r/indiehackers' },
  { src: 'twitter', h: '@theo_ships', where: 'X' },
  { src: 'reddit', h: 'u/cto_kelsey', where: 'r/gamedev' },
  { src: 'twitter', h: '@nadia_pm', where: 'X' },
  { src: 'reddit', h: 'u/lonelyfounder', where: 'r/Entrepreneur' },
  { src: 'twitter', h: '@raj_devtools', where: 'X' },
];

const INTENTS = [
  'looking for an anti-cheat SDK that won\'t tank our frame rate…',
  'anyone know a lightweight cheat detection lib? building a multiplayer FPS',
  'our players keep alt-tabbing to aimbots, need a focus tracker asap',
  'tired of paying $2k/mo for anti-cheat — open source options?',
  'shipping a indie shooter, need tamper detection on a budget',
  'webhook-based violation reporting would be a dream right now',
  'evaluating anti-cheat vendors for our Unity title this sprint',
  'self-hosted anti-cheat with a clean dashboard… does it exist?',
  'memory editor detection without kernel drivers — possible?',
  'we just hit 5k CCU and cheaters are everywhere, help',
];

const TIERS = [
  { label: 'HOT', cls: 'hot', mrr: () => 5 + Math.floor(Math.random() * 8) },   // $5k-12k
  { label: 'WARM', cls: 'warm', mrr: () => 1 + Math.floor(Math.random() * 4) }, // $1k-4k
];

let leadCount = 247;
const feed = document.getElementById('feed');

function makeLead() {
  const who = HANDLES[Math.floor(Math.random() * HANDLES.length)];
  const intent = INTENTS[Math.floor(Math.random() * INTENTS.length)];
  const tier = Math.random() < 0.4 ? TIERS[0] : TIERS[1];
  const mrr = tier.mrr();
  const score = (tier.cls === 'hot' ? 82 : 60) + Math.floor(Math.random() * 17);
  const ago = Math.floor(Math.random() * 50) + 1;

  const el = document.createElement('div');
  el.className = 'lead entering';
  el.innerHTML = `
    <div class="lead-src ${who.src}">${who.src === 'reddit' ? 'r' : '𝕏'}</div>
    <div class="lead-body">
      <div class="lead-top">
        <span class="lead-handle">${who.h}</span>
        <span class="lead-meta">· ${who.where} · ${ago}s ago</span>
        <span class="lead-score">★ ${score}</span>
      </div>
      <div class="lead-text">"${intent}"</div>
      <div class="lead-tags">
        <span class="chip ${tier.cls}">${tier.label} LEAD</span>
        <span class="chip mrr">~$${mrr}k MRR</span>
      </div>
    </div>`;
  return el;
}

function pushLead(dbLead = null) {
  let el;
  if (dbLead) {
    el = document.createElement('div');
    el.className = 'lead entering';
    el.innerHTML = `
      <div class="lead-src ${dbLead.src === 'Reddit' ? 'reddit' : 'twitter'}">${dbLead.src === 'Reddit' ? 'r' : '𝕏'}</div>
      <div class="lead-body">
        <div class="lead-top">
          <span class="lead-handle">${dbLead.handle}</span>
          <span class="lead-meta">· ${dbLead.where} · just now</span>
          <span class="lead-score">★ ${dbLead.score}</span>
        </div>
        <div class="lead-text">"${dbLead.intent}"</div>
        <div class="lead-tags">
          <span class="chip ${dbLead.tier.includes('HOT') ? 'hot' : 'warm'}">${dbLead.tier}</span>
          <span class="chip mrr">~$${(dbLead.mrr/1000).toFixed(1)}k MRR</span>
        </div>
      </div>`;
  } else {
    el = makeLead();
  }
  
  feed.prepend(el);
  while (feed.children.length > 12) feed.removeChild(feed.lastChild);
  leadCount++;
  const kpi = document.querySelector('.kpi-value[data-count="247"]');
  if (kpi) kpi.textContent = leadCount.toLocaleString();
  setTimeout(() => el.classList.remove('entering'), 600);
}

// seed initial feed
for (let i = 0; i < 7; i++) {
  const el = makeLead();
  el.classList.remove('entering');
  feed.appendChild(el);
}

// streaming loop (respects pause)
let streaming = true;

if (HERMES_CONFIG.USE_MOCK_DATA) {
  function tick() {
    if (streaming) pushLead();
    setTimeout(tick, 2600 + Math.random() * 2400);
  }
  setTimeout(tick, 2000);
} else {
  // Real-time WebSocket streaming from local broker!
  if (typeof io !== 'undefined') {
    const socket = io('http://localhost:3000');
    socket.on('connect', () => console.log('🟢 Connected to Hermes Broker'));
    socket.on('new_lead', (lead) => {
      if (streaming) pushLead(lead);
    });
  } else {
    console.warn('⚠️ socket.io script not loaded! Is server.js running?');
  }
}

// ---- Pause / resume ----
const pauseBtn = document.getElementById('pauseBtn');
const statusPill = document.querySelector('.status-pill');
const feedStatus = document.getElementById('feedStatus');
pauseBtn.addEventListener('click', () => {
  streaming = !streaming;
  pauseBtn.textContent = streaming ? 'Pause' : 'Resume';
  statusPill.classList.toggle('paused', !streaming);
  feedStatus.textContent = streaming ? 'Live' : 'Paused';
});

// ---- Count-up KPIs ----
function countUp(el) {
  const target = +el.dataset.count;
  const prefix = el.dataset.prefix || '';
  const dur = 1200;
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.floor(eased * target).toLocaleString();
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = prefix + target.toLocaleString();
  }
  requestAnimationFrame(frame);
}
document.querySelectorAll('.kpi-value').forEach(countUp);

// ---- Conversion ring ----
const rate = 24.7; // 61 / 247
const ringFill = document.getElementById('ringFill');
const ringPct = document.getElementById('ringPct');
const circumference = 2 * Math.PI * 52; // ~327
setTimeout(() => {
  ringFill.style.strokeDashoffset = circumference * (1 - rate / 100);
  // animate the % text
  const start = performance.now();
  function f(now) {
    const p = Math.min((now - start) / 1400, 1);
    ringPct.textContent = (p * rate).toFixed(1) + '%';
    if (p < 1) requestAnimationFrame(f);
    else ringPct.textContent = rate + '%';
  }
  requestAnimationFrame(f);
}, 300);

// ---- Plugin Store (Open-Source Empire Hub) ----
const PLUGINS = [
  { ico: '🎯', name: 'Reddit Sniper Pro', author: '@ggloop/core', desc: 'Deep subreddit monitoring with intent scoring + keyword webhooks.', stars: '2.4k', dl: '18k', installed: true },
  { ico: '🐦', name: 'X Signal Harvester', author: '@ggloop/core', desc: 'Streams Twitter/X for buying-intent signals in real time.', stars: '1.9k', dl: '12k', installed: true },
  { ico: '🧠', name: 'Lead Scorer AI', author: 'community/nova', desc: 'LLM-based qualification — ranks leads by fit & MRR potential.', stars: '3.1k', dl: '27k', installed: false },
  { ico: '💬', name: 'Discord Notifier', author: 'community/pulse', desc: 'Pings your team the instant a HOT lead lands in the feed.', stars: '870', dl: '9.2k', installed: false },
  { ico: '📊', name: 'Conversion Tracker', author: '@ggloop/labs', desc: 'Attribution from first snipe → $29/mo Cloud signup.', stars: '1.2k', dl: '7.8k', installed: false },
  { ico: '⚙️', name: 'Auto-Outreach', author: 'community/forge', desc: 'Drafts a tailored DM reply for each qualified lead.', stars: '2.7k', dl: '15k', installed: false },
];

const storeGrid = document.getElementById('store-grid');
PLUGINS.forEach(p => {
  const card = document.createElement('div');
  card.className = 'plugin';
  card.innerHTML = `
    <div class="plugin-top">
      <div class="plugin-ico">${p.ico}</div>
      <div>
        <div class="plugin-name">${p.name}</div>
        <div class="plugin-author">${p.author}</div>
      </div>
    </div>
    <p class="plugin-desc">${p.desc}</p>
    <div class="plugin-foot">
      <div class="plugin-stats"><span>★ ${p.stars}</span><span>↓ ${p.dl}</span></div>
      <button class="install-btn ${p.installed ? 'installed' : ''}">${p.installed ? '✓ Installed' : 'Install'}</button>
    </div>`;
  const btn = card.querySelector('.install-btn');
  btn.addEventListener('click', () => {
    if (btn.classList.contains('installed')) return;
    btn.textContent = 'Installing…';
    setTimeout(() => {
      btn.classList.add('installed');
      btn.textContent = '✓ Installed';
    }, 700);
  });
  storeGrid.appendChild(card);
});

// ---- Smooth scroll for sidebar links ----
document.querySelectorAll('.side-link[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = document.querySelector(id);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelectorAll('.side-link').forEach(l => l.classList.remove('active'));
      a.classList.add('active');
    }
  });
});
