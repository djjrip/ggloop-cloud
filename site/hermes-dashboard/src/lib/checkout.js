import { HERMES_SOCKET_URL, STRIPE_CONFIG } from './config';

// POST to the CTO's backend to create a Stripe Checkout session, then
// redirect the browser to the returned Stripe-hosted URL.
//
// Backend contract (server.js):
//   POST /api/checkout  { priceId }  ->  { url: "https://checkout.stripe.com/..." }
export async function startCheckout() {
  const res = await fetch(`${HERMES_SOCKET_URL}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: STRIPE_CONFIG.PRICE_ID,
      successUrl: STRIPE_CONFIG.SUCCESS_URL,
      cancelUrl: STRIPE_CONFIG.CANCEL_URL,
    }),
  });

  if (!res.ok) {
    throw new Error(`Checkout failed (${res.status})`);
  }

  const data = await res.json();
  const url = data.url || data.checkoutUrl || data.sessionUrl;
  if (!url) throw new Error('No checkout URL returned by backend');

  // Hand off to Stripe.
  window.location.href = url;
  return url;
}
