const http = require('http');

const players = ['xX_NoScope_Xx', 'TTV_Sweat', 'FaZe_Reject', 'AimBot_Timmy', 'NinjaFan99', 'HackerMan', 'Ghost_Rider', 'SneakyBeaky'];
const servers = ['US-East-1 (Ohio)', 'EU-West-1 (Frankfurt)', 'AP-South-1 (Mumbai)', 'US-West-1 (Cali)'];
const reasons = [
  'CheatEngine.exe Memory Tamper Detected',
  'ProcessHacker Kernel Modification',
  'WeMod Injector Detected',
  'Abnormal mouse tracking (AimBot)',
  'AutoHotkey Macro Scripting',
  'DLL Injection in Game.exe'
];

function fireWebhook() {
  const player = players[Math.floor(Math.random() * players.length)];
  const server = servers[Math.floor(Math.random() * servers.length)];
  const reason = reasons[Math.floor(Math.random() * reasons.length)];
  const action = Math.random() > 0.1 ? 'BAN' : 'KICK'; // mostly bans, some kicks
  const confidence = Math.floor(Math.random() * (100 - 85) + 85); // 85-99%

  const violation = {
    player,
    server,
    reason,
    action,
    confidence, // new field added for table
    ts: Date.now()
  };

  const data = JSON.stringify(violation);

  // Sign request using the demo API credentials
  const crypto = require('crypto');
  const apiKey = 'GGLOOP_pk_live_djjrip_enterprise_demo';
  const apiSecret = 'GGLOOP_sk_live_djjrip_enterprise_secret_9988';
  const hmac = crypto.createHmac('sha256', apiSecret);
  const signature = hmac.update(data).digest('hex');

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/webhooks/anti-cheat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      'X-GGLoop-ApiKey': apiKey,
      'X-GGLoop-Signature': signature
    }
  };

  const req = http.request(options, (res) => {
    // silently process response to avoid log spam
    res.on('data', () => {});
  });

  req.on('error', (e) => {
    console.error(`[Simulator] connection error: ${e.message}`);
  });

  req.write(data);
  req.end();
  console.log(`🔫 [Simulator] Sent ${action} for ${player} -> ${reason}`);
}

// Fire initially
fireWebhook();
// Then fire randomly every 2-6 seconds
function loop() {
  const delay = Math.floor(Math.random() * (6000 - 2000) + 2000);
  setTimeout(() => {
    fireWebhook();
    loop();
  }, delay);
}
loop();

