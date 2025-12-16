require('dotenv').config();
const connectToDatabase = require('../lib/mongodb');

async function testConnection() {
    console.log('Testing MongoDB connection...');
    try {
        const { db } = await connectToDatabase();
        console.log('✅ Successfully connected to database:', db.databaseName);

        // Check if users collection exists or create it implicitly by counting
        const count = await db.collection('users').countDocuments();
        console.log(`✅ Connection verified. Found ${count} users in the database.`);
        console.log('✅ Password connection logic is ready.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error);
        process.exit(1);
    }
}

testConnection();
