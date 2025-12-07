const fs = require('fs');
const path = require('path');

// User provided: mongodb+srv://nongthanganbaphijam_db_useraidesign:<db_password>@nongaistudio.nsc1uvg.mongodb.net/?appName=Nongaistudio
// Password: nong@123 -> nong%40123
const correctUri = 'mongodb+srv://nongthanganbaphijam_db_useraidesign:nong%40123@nongaistudio.nsc1uvg.mongodb.net/?appName=Nongaistudio';

const envContent = `MONGODB_URI=${correctUri}`;

fs.writeFileSync(path.join(__dirname, '..', '.env'), envContent, { encoding: 'utf8' });
console.log('✅ Updated .env with new connection string.');
