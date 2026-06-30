const http = require('http');

const violation = {
  player: 'xX_NoScope_Sniper_Xx',
  server: 'US-East-1',
  reason: 'CheatEngine.exe Memory Tamper Detected',
  action: 'BAN',
  ts: Date.now()
};

const data = JSON.stringify(violation);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/webhooks/anti-cheat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();

console.log('🔫 Fired simulated Anti-Cheat ban webhook...');
