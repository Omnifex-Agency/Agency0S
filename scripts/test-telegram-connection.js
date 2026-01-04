const https = require('https');
const fs = require('fs');
const path = require('path');

// 1. Load Environment Variables manually to avoid dotenv dependency issues
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const env = {};
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim();
                env[key] = value;
            }
        });
        return env;
    } catch (e) {
        console.error("Failed to read .env file:", e.message);
        return {};
    }
}

const env = loadEnv();
const TOKEN = env.TELEGRAM_BOT_TOKEN;
const TARGET_CHAT_ID = env.TELEGRAM_CHAT_ID;

if (!TOKEN) {
    console.error("❌ Error: TELEGRAM_BOT_TOKEN not found in .env");
    process.exit(1);
}

console.log(`🤖 Bot Token: ${TOKEN.substring(0, 10)}...`);
console.log(`🎯 Target Chat ID: ${TARGET_CHAT_ID}`);

// 2. Helper to make requests
function telegramRequest(method, params = {}) {
    return new Promise((resolve, reject) => {
        const url = `https://api.telegram.org/bot${TOKEN}/${method}`;

        // Convert params to JSON if any
        const body = JSON.stringify(params);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body.length
            }
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function runDiagnostics() {
    try {
        // Step 1: Check Bot Identity
        console.log("\n1️⃣  Checking Bot Identity (getMe)...");
        const me = await telegramRequest('getMe');
        if (!me.ok) {
            console.error("❌ Failed to connect to Bot:", me);
            return;
        }
        console.log(`✅ Bot Connected: @${me.result.username} (ID: ${me.result.id})`);

        // Step 2: Check Updates to find Chat ID
        console.log("\n2️⃣  Checking Recent Messages (getUpdates)...");
        const updates = await telegramRequest('getUpdates');

        if (!updates.ok) {
            console.error("❌ Failed to get updates:", updates);
        } else {
            console.log(`ℹ️  Found ${updates.result.length} updates.`);

            const chats = new Set();
            updates.result.forEach(u => {
                if (u.message && u.message.chat) {
                    chats.add(`${u.message.chat.type}: ${u.message.chat.id} (${u.message.chat.username || u.message.chat.title})`);
                }
            });

            if (chats.size > 0) {
                console.log("   Recent Chats found:");
                chats.forEach(c => console.log(`   - ${c}`));
            } else {
                console.log("   ⚠️  No recent messages found. Please send a message to the bot now!");
            }
        }

        // Step 3: Test Sending Message
        console.log(`\n3️⃣  Testing Send Message to ${TARGET_CHAT_ID}...`);
        const send = await telegramRequest('sendMessage', {
            chat_id: TARGET_CHAT_ID,
            text: "✅ Diagnostics Test: Connection Successful!"
        });

        if (send.ok) {
            console.log("✅ Message Sent Successfully!");
        } else {
            console.error("❌ Message Failed:", send);
            if (send.error_code === 400 && send.description.includes("chat not found")) {
                console.log("\n💡 DIAGNOSIS: 'Chat not found'");
                console.log("   This means the user has not started the bot yet.");
                console.log(`   ACTION: Open Telegram, search for @${me.result.username}, and click START.`);
                console.log("   Then run this script again.");
            }
        }

    } catch (e) {
        console.error("Unexpected Error:", e);
    }
}

runDiagnostics();
