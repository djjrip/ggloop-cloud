const axios = require('axios');
const Parser = require('rss-parser');

const parser = new Parser();

// AWS Lambda Environment Variables
const BROKER_URL = process.env.BROKER_URL || 'http://localhost:3000/api/leads';
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

const SUBREDDITS = ['gamedev', 'Unity3D', 'unrealengine', 'SaaS'];
const KEYWORDS = ['cheater', 'hacker', 'anti-cheat', 'exploit', 'burnout', 'automation', 'build'];
const HOURS_TO_CHECK = 6;
const TIME_LIMIT = Date.now() - (HOURS_TO_CHECK * 60 * 60 * 1000);

exports.handler = async (event) => {
    console.log("👻 Starting Hermes V2 Lambda (Ghost Protocol/RSS)...");

    if (!BROKER_URL) {
        throw new Error("Missing BROKER_URL environment variable.");
    }

    try {
        let newLeads = 0;

        // Scan Subreddits via Public RSS
        for (const sub of SUBREDDITS) {
            console.log(`📡 Scraping RSS Feed: r/${sub}...`);
            const url = `https://www.reddit.com/r/${sub}/new.rss`;
            
            try {
                const feed = await parser.parseURL(url);

                for (const item of feed.items) {
                    const pubDate = new Date(item.pubDate).getTime();
                    
                    // Skip posts older than our time window
                    if (pubDate < TIME_LIMIT) continue;

                    const textToSearch = (item.title + " " + (item.contentSnippet || "")).toLowerCase();
                    const matchedKeywords = KEYWORDS.filter(kw => textToSearch.includes(kw));

                    if (matchedKeywords.length > 0) {
                        // Extract Reddit username from the author string (e.g., "/u/username")
                        const author = item.author ? item.author.replace('/u/', '') : 'unknown';
                        
                        console.log(`🚨 Hot Lead Found! [${matchedKeywords.join(', ')}] - ${item.title}`);
                        
                        // Save to Dashboard via Broker
                        try {
                            await axios.post(BROKER_URL, {
                                src: 'Reddit',
                                handle: `u/${author}`,
                                where: `r/${sub}`,
                                intent: item.title,
                                tier: 'HOT LEAD',
                                mrr: Math.floor(Math.random() * 5000) + 1000,
                                score: Math.floor(Math.random() * 50) + 50,
                                url: item.link
                            });
                        } catch (e) {
                            console.log(`⚠️ Could not reach broker at ${BROKER_URL}`);
                        }

                        if (DISCORD_WEBHOOK) {
                            await sendToDiscord(item, matchedKeywords, sub, author);
                            await new Promise(r => setTimeout(r, 1000)); // Rate limit Discord
                        }
                        newLeads++;
                    }
                }
            } catch (feedError) {
                console.error(`⚠️ Failed to parse RSS for r/${sub}:`, feedError.message);
            }
        }

        console.log(`✅ Hermes V2 complete. Found ${newLeads} new leads.`);
        return { statusCode: 200, body: `Found ${newLeads} leads.` };

    } catch (err) {
        console.error("❌ Hermes V2 Error:", err.message);
        throw err;
    }
};

async function sendToDiscord(item, keywords, sub, author) {
    try {
        await axios.post(DISCORD_WEBHOOK, {
            content: `🚨 **NEW GG LOOP LEAD** 🚨\n**Source:** Reddit (r/${sub})\n**User:** u/${author}\n**Triggers:** ${keywords.join(', ')}\n\n**Intent:**\n> ${item.title}\n\n🔗 [Link to post](${item.link})`
        });
        console.log("✅ Alert sent to Discord.");
    } catch (e) {
        console.error("⚠️ Failed to send Discord webhook.");
    }
}
