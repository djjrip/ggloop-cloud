require('dotenv').config();
const hermes = require('./index.js');

async function runLocal() {
    console.log("🚀 Starting Hermes V2 Local Execution...");
    try {
        const result = await hermes.handler({});
        console.log("✅ Execution Complete:", result);
    } catch (err) {
        console.error("❌ Execution Failed:", err);
    }
}

runLocal();
