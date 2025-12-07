const { MongoClient } = require('mongodb');

// Use dummy password to test connectivity vs auth
const uri = 'mongodb+srv://nongthanganbaphijam_db_useraidesign:WRONGPASS@nongaistudio.nsc1uvg.mongodb.net/?appName=Nongaistudio';

async function test() {
    console.log('Testing connectivity with dummy password...');
    try {
        await MongoClient.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('❌ Unexpected success (Should fail auth)');
    } catch (err) {
        if (err.message.includes('Authentication failed')) {
            console.log('✅ Connectivity OK! (Auth failed as expected)');
            console.log('   -> Issue is likely the REAL password.');
        } else if (err.message.includes('timed out')) {
            console.log('❌ Timeout! (Firewall/Network blocking)');
            console.log('   -> Issue is IP Whitelist or Cluster Paused.');
        } else {
            console.log('❓ Error:', err.message);
        }
        process.exit(1);
    }
}
test();
