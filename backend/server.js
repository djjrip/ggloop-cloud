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

// Stripe Checkout Endpoint
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/checkout', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;