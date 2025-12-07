const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Load .env manually
try {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim();
                process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.error('Error loading .env:', e.message);
}

const uri = process.env.MONGODB_URI;

console.log('---------------------------------------------------');
console.log('🔍 Verifying MongoDB Connection from .env');
console.log('---------------------------------------------------');

if (!uri) {
    console.error('❌ Error: MONGODB_URI not found in .env');
    process.exit(1);
}

if (uri.includes('YOUR_PASSWORD_HERE')) {
    console.error('❌ Error: Default placeholder "YOUR_PASSWORD_HERE" found.');
    console.error('👉 Please open .env and replace it with your actual password.');
    process.exit(1);
}

async function test() {
    try {
        console.log('connecting...');
        const client = await MongoClient.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
        console.log('   Database: ' + (client.db().databaseName || 'test'));
        await client.close();
        process.exit(0);
    } catch (err) {
        console.error('❌ FAILED: Could not connect.');
        console.error('   Reason:', err.message);
        console.error('');
        console.error('👉 Common fixes:');
        console.error('   1. Check password is correct (no extra spaces?)');
        console.error('   2. Whitelist IP 0.0.0.0/0 in Atlas Network Access');
        process.exit(1);
    }
}

test();
