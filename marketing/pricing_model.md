# GG Loop — SaaS Pricing & Tiering Strategy

Anti-cheat is traditionally priced opaquely via massive yearly enterprise contracts. GG Loop will disrupt this by offering transparent, developer-friendly tiering that scales from indie startups directly to AAA enterprises.

## Tier 1: Startup (Free)
**Target:** Indie studios and student teams validating their multiplayer games.
- **Price:** $0/mo
- **Usage Limit:** Up to 10,000 Monthly Active Users (MAU)
- **Features:** 
  - Standard User-Mode Process Scanner & Window Focus Tracking
  - Standard REST Webhook reporting (max 1 payload per second)
  - Community Discord Support
  - Shared SaaS Infrastructure (GG Loop hosts the telemetry receiver)

## Tier 2: Studio ($1,500/mo)
**Target:** Mid-market games, heavily funded Web3 games, and growing studios.
- **Price:** $1,500/mo
- **Usage Limit:** Up to 100,000 MAU ($0.02 per additional user)
- **Features:**
  - *Everything in Startup, plus:*
  - Real-time WebSocket Telemetry (sub-50ms latency)
  - Advanced Heuristics (Memory tampering signatures)
  - Next-Day Email Support
  - Shared SaaS Infrastructure with Dedicated Tenant Database

## Tier 3: Enterprise VPC ($15,000/mo)
**Target:** AAA Studios (Epic, Riot, Valve, Activision).
- **Price:** $15,000/mo (Billed Annually) + $25k One-Time Implementation Fee
- **Usage Limit:** Unlimited MAU
- **Features:**
  - *Everything in Studio, plus:*
  - **100% Data Sovereignty:** Telemetry gateway is deployed natively inside the studio's own AWS/GCP VPC. GG Loop never touches player data.
  - Dedicated Solutions Architect & Slack Channel
  - 99.99% Uptime SLA
  - Custom Machine Learning Integration (feeding local telemetry into their server-side AI like VACnet)

---
**Strategy Note for Sales:**
Always push Enterprise VPC for any studio with >100k MAU. The massive selling point isn't just the tech, it's the fact that they don't have to pass GDPR/CCPA data outside their own firewall.
