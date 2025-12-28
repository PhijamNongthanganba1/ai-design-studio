require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testConnection() {
    console.log('Testing MongoDB Connection to "nongaistudio"...');
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI is missing');
        return;
    }

    try {
        const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
        await client.connect();

        const db = client.db('nongaistudio');
        console.log('✅ Connected. Database:', db.databaseName);

        const users = await db.collection('users').find({}).toArray();
        console.log(`Found ${users.length} users.`);
        if (users.length > 0) {
            console.log('Sample Emails:', users.map(u => u.email));
        } else {
            console.log('⚠️ No users found! Please Sign Up first.');
        }

        await client.close();
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
    }
}

testConnection();
