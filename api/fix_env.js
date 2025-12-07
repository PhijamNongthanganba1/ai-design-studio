const fs = require('fs');
const path = require('path');

const correctUri = 'mongodb+srv://nongthanganbaphijam_db_useraidesign:nong%40123@nongaistudio.nsc1uvg.mongodb.net/?appName=Nongaistudio';
// Ensure no BOM and plain UTF-8
const envContent = `MONGODB_URI=${correctUri}`;

fs.writeFileSync(path.join(__dirname, '..', '.env'), envContent, { encoding: 'utf8' });
console.log('✅ Corrected .env file with UTF-8 encoding.');
