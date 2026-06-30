// ============================================================
// HERMES V2 — frontend config
// The CTO's backend broadcasts real Reddit leads over Socket.IO.
// ============================================================
export const HERMES_SOCKET_URL = 'http://localhost:3000';

// If the socket can't connect within this window, the UI shows offline.
export const SOCKET_CONNECT_TIMEOUT_MS = 3500;

// Event names emitted by the Hermes broker.
export const EVENTS = {
  NEW_LEAD: 'new_lead',
};

// Stripe config — replace with real keys from stripe.com/dashboard
export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: 'pk_live_51TdgGZRqsNN4Xgy6mqbFmDrPddxm581WVUD0mYLQeILdSD52y5sHcUVhYcP0x7lKjWFn6FlK44d2sGqsjFBRxpxC00uGoi2WhX', // pk_live_... or pk_test_...
  PRICE_ID: 'price_1To4ahRqsNN4Xgy6qAyQ8zrY',        // price_... from Stripe product dashboard
  SUCCESS_URL: window.location.origin + '/success',
  CANCEL_URL: window.location.origin,
};

// GG Loop Cloud pricing
export const PRICING = {
  FOUNDING_MEMBER: { price: 29, label: 'Founding Member', period: '/mo' },
};
