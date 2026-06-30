async function injectTestLead() {
    const fakeLead = {
        src: Math.random() > 0.5 ? 'Reddit' : 'Twitter',
        handle: `u/founder_${Math.floor(Math.random() * 1000)}`,
        where: Math.random() > 0.5 ? 'r/SaaS' : 'r/gamedev',
        intent: 'I need an auto-build AI yesterday. Take my money.',
        tier: Math.random() > 0.2 ? 'HOT LEAD' : 'WARM LEAD',
        mrr: Math.floor(Math.random() * 10000) + 1000,
        score: Math.floor(Math.random() * 20) + 80
    };

    try {
        const res = await fetch('http://localhost:3000/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fakeLead)
        });
        if (res.ok) {
            console.log(`✅ Injected: ${fakeLead.handle}`);
        } else {
            console.log("❌ Server returned error");
        }
    } catch (err) {
        console.error("❌ Failed to connect to broker. Is server.js running?");
    }
}

console.log("🚀 Starting Lead Generator. Firing every 3 seconds...");
setInterval(injectTestLead, 3000);
