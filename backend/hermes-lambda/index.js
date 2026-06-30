const axios = require('axios');

// AWS Lambda Environment Variables
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;
const REDDIT_USERNAME = process.env.REDDIT_USERNAME;
const REDDIT_PASSWORD = process.env.REDDIT_PASSWORD;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

const SUBREDDITS = ['gamedev', 'Unity3D', 'unrealengine', 'SaaS'];
const KEYWORDS = ['cheater', 'hacker', 'anti-cheat', 'exploit', 'burnout', 'automation'];
const HOURS_TO_CHECK = 6;
const TIME_LIMIT_SECONDS = Date.now() / 1000 - (HOURS_TO_CHECK * 60 * 60);

exports.handler = async (event) => {
    console.log("🤖 Starting Hermes V2 Lambda...");

    if (!REDDIT_CLIENT_ID || !DISCORD_WEBHOOK) {
        throw new Error("Missing critical environment variables.");
    }

    try {
        // 1. Authenticate with Reddit API (Official OAuth)
        const authHeader = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64');
        const authResponse = await axios.post('https://www.reddit.com/api/v1/access_token', 
            `grant_type=password&username=${REDDIT_USERNAME}&password=${REDDIT_PASSWORD}`,
            {
                headers: {
                    'Authorization': `Basic ${authHeader}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'GG-Loop-Hermes/2.0'
                }
            }
        );

        const accessToken = authResponse.data.access_token;
        console.log("✅ Authenticated with Reddit API.");

        let newLeads = 0;

        // 2. Scan Subreddits
        for (const sub of SUBREDDITS) {
            console.log(`📡 Scanning r/${sub}...`);
            const url = `https://oauth.reddit.com/r/${sub}/new.json?limit=25`;
            
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'User-Agent': 'GG-Loop-Hermes/2.0'
                }
            });

            const posts = response.data.data.children;

            for (const post of posts) {
                const p = post.data;
                
                // Skip posts older than our time window
                if (p.created_utc < TIME_LIMIT_SECONDS) continue;

                const textToSearch = (p.title + " " + (p.selftext || "")).toLowerCase();
                const matchedKeywords = KEYWORDS.filter(kw => textToSearch.includes(kw));

                if (matchedKeywords.length > 0) {
                    console.log(`🚨 Hot Lead Found! [${matchedKeywords.join(', ')}] - ${p.title}`);
                    await sendToDiscord(p, matchedKeywords);
                    newLeads++;
                    await new Promise(r => setTimeout(r, 1000)); // Rate limit Discord
                }
            }
        }

        console.log(`✅ Hermes V2 complete. Found ${newLeads} new leads.`);
        return { statusCode: 200, body: `Found ${newLeads} leads.` };

    } catch (err) {
        console.error("❌ Hermes V2 Error:", err.response ? err.response.data : err.message);
        throw err;
    }
};

async function sendToDiscord(post, keywords) {
    const embed = {
        title: `🚨 Qualified Lead in r/${post.subreddit}`,
        description: `**${post.title}**\n\n${post.selftext ? post.selftext.substring(0, 300) : ''}...`,
        url: `https://reddit.com${post.permalink}`,
        color: 0x00FF00,
        fields: [
            { name: "Matched Keywords", value: keywords.join(', '), inline: true },
            { name: "Author", value: `u/${post.author}`, inline: true }
        ],
        footer: { text: "Hermes V2 • GG Loop Engine" },
        timestamp: new Date(post.created_utc * 1000).toISOString()
    };

    await axios.post(DISCORD_WEBHOOK, { embeds: [embed] });
}
