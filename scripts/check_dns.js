const dns = require('dns');
const host = 'nongaistudio.nsc1uvg.mongodb.net';

console.log(`Resolving ${host}...`);
dns.lookup(host, (err, address, family) => {
    if (err) {
        console.error('❌ DNS Lookup Failed:', err.message);
        console.error('   This implies the Cluster Name is wrong or does not exist.');
    } else {
        console.log('✅ DNS Resolved:', address);
        console.log('   Host exists. Timeout is likely Firewall/IP Whitelist.');
    }
});
