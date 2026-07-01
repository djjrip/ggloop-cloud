require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve as the broker: clients connect here
io.on('connection', async (socket) => {
  console.log(`🔌 Dashboard connected: ${socket.id}`);
  
  try {
    // Send initial data to dashboard on connection so they don't see empty screens
    const leads = await db.getLeads();
    const violations = await db.getViolations();
    socket.emit('initial_leads', leads);
    socket.emit('initial_violations', violations);
  } catch (err) {
    console.error("❌ Socket Connection DB Error:", err.message);
  }
  
  socket.on('disconnect', () => {
    console.log(`❌ Dashboard disconnected: ${socket.id}`);
  });
});

// REST API endpoint for Lambda to push leads
app.post('/api/leads', async (req, res) => {
  const lead = req.body;
  if (!lead || !lead.handle) {
    return res.status(400).json({ error: 'Invalid lead data' });
  }

  // Ensure created_at exists for frontend sorting
  lead.created_at = lead.created_at || Date.now();

  console.log(`🚨 Broadcast: ${lead.tier} [${lead.handle}] -> ${lead.intent}`);
  
  try {
    // Persist to database
    await db.insertLead(lead);
    
    // Instantly broadcast lead to all connected Dashboards via WebSocket
    io.emit('new_lead', lead);
    
    res.status(200).json({ success: true, message: 'Lead broadcasted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Key Generation Endpoint
app.post('/api/keys/generate', async (req, res) => {
  try {
    const pair = await db.generateAndAddKey();
    console.log(`🔑 Generated API Key: ${pair.key}`);
    res.status(200).json(pair);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REST Endpoint to fetch historical logs
app.get('/api/history', async (req, res) => {
  try {
    res.status(200).json({
      leads: await db.getLeads(),
      violations: await db.getViolations()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REST Endpoint to fetch generated B2B outreach pitches
app.get('/api/outreach', async (req, res) => {
  try {
    const outreach = require('./outreach_engine');
    const campaigns = await outreach.runCampaigns();
    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REST Endpoint to autonomously send cold emails via Resend API
app.post('/api/outreach/send', async (req, res) => {
  const { to, subject, body } = req.body;
  const apiKey = process.env.RESEND_API_KEY;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required email fields (to, subject, body)' });
  }

  if (!apiKey) {
    return res.status(400).json({ 
      error: 'Resend API Key is missing in server .env file. Please add RESEND_API_KEY to enable autonomous outreach!' 
    });
  }

  const https = require('https');
  const payload = JSON.stringify({
    from: 'GG Loop Outreach <onboarding@resend.dev>', // Resend default fallback. Verify ggloop.io on Resend to send as jaysonquindao@ggloop.io
    to: to,
    subject: subject,
    text: body
  });

  const options = {
    hostname: 'api.resend.com',
    port: 443,
    path: '/emails',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    }
  };

  const emailReq = https.request(options, (emailRes) => {
    let data = '';
    emailRes.on('data', (chunk) => { data += chunk; });
    emailRes.on('end', () => {
      if (emailRes.statusCode >= 200 && emailRes.statusCode < 300) {
        console.log(`✉️ [OUTREACH] Cold email successfully dispatched to ${to}`);
        res.status(200).json({ success: true, message: 'Outreach email successfully sent!' });
      } else {
        console.error('❌ Resend API returned error:', data);
        res.status(emailRes.statusCode).json({ error: `Resend API Error: ${data}` });
      }
    });
  });

  emailReq.on('error', (err) => {
    console.error('❌ Failed to send email via Resend:', err.message);
    res.status(500).json({ error: `Network error: ${err.message}` });
  });

  emailReq.write(payload);
  emailReq.end();
});

// Anti-Cheat Webhook Receiver with HMAC Security
app.post('/api/webhooks/anti-cheat', async (req, res) => {
  const signature = req.headers['x-ggloop-signature'];
  const apiKey = req.headers['x-ggloop-apikey'];
  let violation = req.body;

  if (!violation) {
    return res.status(400).json({ error: 'Invalid violation data' });
  }

  // Enforce cryptographic security check
  if (!signature || !apiKey) {
    console.warn(`⚠️ Blocked unsigned webhook request from IP ${req.ip}`);
    return res.status(401).json({ error: 'Unauthorized: Missing signature or API key headers' });
  }

  try {
    // Verify signature matches the request payload raw body
    const isValid = await db.verifyApiKeyAndSignature(apiKey, signature, req.rawBody || JSON.stringify(violation));
    if (!isValid) {
      return res.status(403).json({ error: 'Forbidden: Cryptographic signature mismatch' });
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

    console.log(`🚨 SECURE BAN EVENT: [${violation.player}] -> ${violation.reason} (Server: ${violation.server})`);
    
    // Persist to database
    await db.insertViolation(violation);
    
    // Instantly broadcast ban to all connected Dashboards via WebSocket
    io.emit('ban_event', violation);
    
    res.status(200).json({ success: true, message: 'Ban verified and broadcasted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stripe Payment Webhook Receiver
app.post('/api/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (stripe && endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } else {
      // Fallback for local development testing without webhook secrets
      event = req.body;
    }
  } catch (err) {
    console.error('⚠️ Stripe Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful subscriptions
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(`💳 [STRIPE] Subscription payment completed for session: ${session.id}`);

    try {
      // Generate and persist a real API key/secret pair in the database
      const pair = await db.generateAndAddKey();
      console.log(`🔑 [STRIPE] Auto-minted credentials for new subscriber: ${pair.key}`);
    } catch (err) {
      console.error('❌ Failed to auto-mint subscriber credentials:', err.message);
    }
  }

  res.json({ received: true });
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
  
  // Boot and run autonomous B2B campaigns
  const outreach = require('./outreach_engine');
  outreach.runCampaigns().catch(err => console.error("❌ Outreach Engine Boot Error:", err.message));
});
