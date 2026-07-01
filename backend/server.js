require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve as the broker: clients connect here
io.on('connection', (socket) => {
  console.log(`🔌 Dashboard connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`❌ Dashboard disconnected: ${socket.id}`);
  });
});

// REST API endpoint for Lambda to push leads
app.post('/api/leads', (req, res) => {
  const lead = req.body;
  if (!lead || !lead.handle) {
    return res.status(400).json({ error: 'Invalid lead data' });
  }

  // Ensure created_at exists for frontend sorting
  lead.created_at = lead.created_at || Date.now();

  console.log(`🚨 Broadcast: ${lead.tier} [${lead.handle}] -> ${lead.intent}`);
  
  // Instantly broadcast lead to all connected Dashboards via WebSocket
  io.emit('new_lead', lead);
  
  res.status(200).json({ success: true, message: 'Lead broadcasted successfully' });
});

// Anti-Cheat Webhook Receiver
app.post('/api/webhooks/anti-cheat', (req, res) => {
  let violation = req.body;
  if (!violation) {
    return res.status(400).json({ error: 'Invalid violation data' });
  }

  // If it's a real SDK event (has sessionId & processName, but no player)
  if (!violation.player && violation.sessionId) {
    violation = {
      player: violation.sessionId,
      server: violation.windowTitle || 'US-East-1 (SDK Node)',
      reason: violation.reason || `${violation.processName} Detected`,
      action: 'BAN',
      confidence: 99,
      ts: violation.timestamp ? Date.parse(violation.timestamp) : Date.now()
    };
  }

  if (!violation.player) {
    return res.status(400).json({ error: 'Invalid violation data: missing player or sessionId' });
  }

  // Ensure ts exists for frontend sorting
  violation.ts = violation.ts || Date.now();

  console.log(`🚨 BAN EVENT: [${violation.player}] -> ${violation.reason} (Server: ${violation.server})`);
  
  // Instantly broadcast ban to all connected Dashboards via WebSocket
  io.emit('ban_event', violation);
  
  res.status(200).json({ success: true, message: 'Ban broadcasted successfully' });
});

// Stripe Checkout Endpoint
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? require('stripe')(stripeKey) : null;

app.post('/api/checkout', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe is not configured on the server yet. Check your .env file.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 GG Loop Lead Broker running on http://localhost:${PORT}`);
  console.log(`   WebSockets ready. Waiting for dashboard connections...`);
});
