const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = await MongoClient.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
    });

    const db = client.db('ai-design-studio');

    cachedClient = client;
    cachedDb = db;

    return { client, db };
}

module.exports = connectToDatabase;
