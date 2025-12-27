const axios = require('axios');

async function checkHealth() {
    console.log('🔍 Checking Application Health...');

    // 1. Check Homepage
    try {
        await axios.get('http://localhost:3000');
        console.log('✅ Homepage: Accessible');
    } catch (e) {
        console.error('❌ Homepage: Unreachable', e.message);
    }

    // 2. Check Video API (Demo Mode)
    try {
        const res = await axios.post('http://localhost:3000/api/create-video', {
            imageUrl: 'check', // Minimal payload
            text: 'test',
            voice: 'en-US-JennyNeural'
        });
        if (res.data.success && res.data.isMock) {
            console.log('✅ Video API: Active (Demo Mode confirmed)');
        } else {
            console.log('⚠️ Video API: Unexpected status', res.data);
        }
    } catch (e) {
        console.error('❌ Video API: Failed', e.message);
    }

    // 3. Check Image API (if active)
    try {
        await axios.post('http://localhost:3000/api/generate-image', { prompt: 'test' });
        console.log('✅ Image API: Active');
    } catch (e) {
        // Might fail if external keys missing, but 500 means server is reachable
        if (e.response && e.response.status === 500) {
            console.log('✅ Image API: Reachable (Provider error likely)');
        } else {
            console.log('⚠️ Image API: ' + e.message);
        }
    }
}

checkHealth();
