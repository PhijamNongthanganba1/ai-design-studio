const { MongoClient } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable in .env');
    }

    const client = await MongoClient.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
    });

    const db = client.db('nongaistudio');
    console.log('Connected to database:', db.databaseName);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
}

module.exports = connectToDatabase;
