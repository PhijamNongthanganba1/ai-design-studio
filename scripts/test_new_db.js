const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://nongthanganbaphijam_db_useraidesign:nongthang123@nongaistudio.nsc1uvg.mongodb.net/?appName=Nongaistudio";

async function test() {
    console.log('Testing connection to:', uri.replace(/:([^@]+)@/, ':****@'));
    try {
        const client = await MongoClient.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connected successfully to MongoDB!');
        const db = client.db('ai-design-studio'); // Or whatever the default db is
        console.log('   Database:', db.databaseName);
        await client.close();
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }
}

test();
