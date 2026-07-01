# GG Loop SDK: Proof of Concept Demo Video Script

**Target Length:** 2.5 - 3 minutes
**Format:** Loom or Screen Recording with Picture-in-Picture (Facecam in corner)
**Goal:** Prove to VPs of Engineering that the SDK is genuinely zero-dependency, works instantaneously, and logs telemetry correctly.

---

### [0:00 - 0:30] Introduction & Value Prop
**Visuals:** 
- Facecam full screen, then shrinking to the corner.
- Screen showing the GG Loop Landing Page.

**Script:**
> "Hey team, Jayson here. I know as engineering leaders at [Studio Name], you get pitched anti-cheat solutions constantly. But almost all of them require invasive kernel drivers and sending your player data to a third-party server. 
> 
> Today, I'm going to show you GG Loop. It’s a 15-minute, zero-dependency SDK that runs entirely in user space. And best of all, the telemetry gateway deploys directly into *your* AWS VPC. Let me prove it to you live."

---

### [0:30 - 1:15] The Technical Setup
**Visuals:**
- Split screen: Left side shows a simple Game Client or Terminal (representing the game). Right side shows the GG Loop Admin Dashboard (Orchestrator).
- Briefly pull up the code editor to show the 3 lines of initialization code.

**Script:**
> "On the left, I have a simulated game client running our TypeScript SDK. It took exactly three lines of code to initialize. 
> 
> On the right is the GG Loop Dashboard, which is reading directly from the secure webhook receiver. Notice that I haven't installed any drivers, and I don't have Administrator privileges. It's just a raw, unprivileged process."

---

### [1:15 - 2:00] The Cheat Detection Live Test
**Visuals:**
- Open the Windows Start Menu and launch 'Cheat Engine' or 'x64dbg'.
- Instantly, the right side of the screen (the Dashboard) should flash red and a new violation should appear.

**Script:**
> "Now, I'm a bad actor. I'm going to open Cheat Engine to try and hook into the game memory. 
> 
> *[Launch Cheat Engine]*
> 
> Instantly—within milliseconds—the SDK detected the unauthorized process signature and the window focus event. It immediately fired a cryptographically signed HMAC SHA-256 webhook to the backend."

---

### [2:00 - 2:45] The VPC / Data Sovereignty Closer
**Visuals:**
- Show the raw JSON payload in the terminal to prove it sends session IDs and timestamps. 
- Pull up an AWS Architecture Diagram showing the GG Loop gateway sitting inside a private VPC.

**Script:**
> "Here is the exact JSON payload that was transmitted. 
> 
> But here is why this matters for your studio: this webhook didn't go to my servers. It went to a private telemetry gateway that we deploy inside *your* AWS infrastructure. You maintain 100% data sovereignty. We give you the raw intelligence; you decide whether to ban the player, shadowban them, or flag their account for server-side VACnet analysis.
> 
> It's lightweight, it respects player privacy, and it scales infinitely."

---

### [2:45 - 3:00] Call to Action
**Visuals:**
- Full screen facecam.

**Script:**
> "I'd love to jump on a quick 15-minute technical sync next week to show you the architecture in more depth. Just reply to this email, and let's secure the next generation of competitive integrity."
