const dns = require('dns');
const host = 'atlas-sql-693510f1e6707c731035e673-honnpc.a.query.mongodb.net';

console.log(`Resolving SQL Host ${host}...`);
dns.lookup(host, (err, address, family) => {
    if (err) {
        console.error('❌ SQL DNS Lookup Failed:', err.message);
    } else {
        console.log('✅ SQL DNS Resolved:', address);
        console.log('   Confirmed: User has a Federated DB Instance active.');
    }
});
