// GG Loop Autonomous B2B Outreach Engine
// Dynamically generates hyper-targeted sales pitches to top gaming companies based on real security needs.

const db = require('./database');

const TARGET_COMPANIES = [
  {
    studio: "Microsoft Xbox (ID@Xbox)",
    lead: "Director of Xbox Live Developer Ecosystem",
    angle: "Cross-play security. PC cheaters ruin competitive multiplayer games for Xbox console players. GG Loop provides ID@Xbox developers a lightweight, 15-minute trust SDK to secure PC clients before they cross-play with Xbox consoles.",
    email: "xbox-dev-security@microsoft.com"
  },
  {
    studio: "Riot Games (Valorant / League of Legends)",
    lead: "VP of Anti-Cheat Engineering",
    angle: "Private Cloud VPC hosting. Big studios hate sending player telemetry to third-party servers. We allow Riot to host the GG Loop telemetry gateway inside their own secure AWS VPC, giving them 100% data sovereignty.",
    email: "security-partnerships@riotgames.com"
  },
  {
    studio: "Activision Blizzard (Call of Duty / Warzone)",
    lead: "Head of Anti-Cheat Operations (Ricochet)",
    angle: "Lightweight user-mode process scanning as a secondary defense layer for Call of Duty Warzone client launchpads to catch cheat engine injections before kernel-mode hooks load.",
    email: "ricochet-ops@activision.com"
  }
];

class OutreachEngine {
  generatePitch(company) {
    const pitch = `
Subject: Scaling B2B Developer Trust Gateway — GG Loop Private VPC for ${company.studio}

Hi ${company.lead.split(' ').slice(-1)[0] || 'Team'},

I've been monitoring the developer hiring signals across the multiplayer sector, and I noticed ${company.studio} is continuing to scale resources to protect competitive match integrity.

We just launched the GG Loop Private Cloud Gateway. Unlike traditional anti-cheat engines (EAC/BattlEye) which require complex, intrusive kernel-mode drivers and third-party data custody, we provide:

1. A 15-minute, zero-dependency SDK (Unity C# / Unreal C++ native) for process and window focus tracking.
2. A cryptographically signed (HMAC SHA-256) telemetry webhook gateway.
3. Private VPC Deployment: We deploy the entire telemetry receiver inside your own AWS infrastructure, ensuring 100% player data sovereignty.

Given your role leading the ${company.lead} group, I wanted to see if you have 10 minutes next Tuesday for a brief technical walkthrough of our Private VPC gateway architecture.

Best regards,

Jayson Quindao
Founder, GG Loop
jaysonquindao@ggloop.io
    `;
    return pitch.trim();
  }

  async runCampaigns() {
    console.log("📡 [OUTREACH] Running autonomous B2B prospect generation...");
    const campaigns = [];
    
    for (const company of TARGET_COMPANIES) {
      const emailContent = this.generatePitch(company);
      
      const leadEntry = {
        handle: company.studio,
        src: "Outreach_Engine",
        url: company.email,
        intent: `Targeting: ${company.lead}. Angle: ${company.angle.substring(0, 100)}...`,
        tier: "ENTERPRISE",
        mrr: 15000,
        score: 95
      };

      // Add to database leads list
      await db.insertLead(leadEntry);
      
      campaigns.push({
        studio: company.studio,
        lead: company.lead,
        email: company.email,
        pitch: emailContent
      });
    }
    
    console.log("✅ [OUTREACH] Generated 3 B2B campaigns and injected them into the Lead Broker database.");
    return campaigns;
  }
}

module.exports = new OutreachEngine();
