const { MongoClient } = require('mongodb');

// Construct URI with provided creds and OLD host
// Password 'nong@123' -> encoding '@' is good practice but driver might handle it. 
// Let's rely on template literal which usually needs manual encoding for special chars in connection strings.
const password = encodeURIComponent('nong@123');
const uri = `mongodb+srv://nongthang:${password}@ai-design-studio.c8bllig.mongodb.net/?retryWrites=true&w=majority&appName=ai-design-studio`;

console.log('Testing Connection to:', uri.replace(password, '****'));

async function test() {
    try {
        const client = await MongoClient.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ SUCCESS! Connected to old cluster with new credentials.');
        await client.close();
        process.exit(0);
    } catch (err) {
        console.error('❌ FAILED:', err.message);
        if (err.message.includes('getaddrinfo')) {
            console.log('-> Host not found (Cluster deleted?)');
        } else if (err.message.includes('Authentication failed')) {
            console.log('-> Bad Auth (User not created?)');
        }
        process.exit(1);
    }
}

test();
