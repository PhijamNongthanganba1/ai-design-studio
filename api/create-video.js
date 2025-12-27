const axios = require('axios');

module.exports = async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { imageUrl, text, voice = 'en-US-JennyNeural' } = req.body;

    if (!imageUrl || !text) {
        return res.status(400).json({ error: 'Image and script text are required' });
    }

    const DID_API_KEY = process.env.DID_API_KEY;

    try {
        // 1. Check for Demo Mode / Missing Key
        if (!DID_API_KEY || DID_API_KEY === 'your_did_key_here') {
            console.log('[Video] No D-ID API Key found. Returning high-quality demo.');
            await new Promise(resolve => setTimeout(resolve, 3000));
            return res.json({
                success: true,
                videoUrl: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
                message: 'AI Video Generated (Demo Mode). Add DID_API_KEY to .env for real calls.',
                isMock: true,
                type: 'video'
            });
        }

        console.log(`[Video] Starting D-ID generation for: "${text.substring(0, 30)}..."`);

        // 2. Validate Image URL for Real Mode
        // D-ID requires a public http/https URL. Base64 is NOT supported.
        if (imageUrl.startsWith('data:')) {
            console.warn('[Video] Blocked Base64 image in Real Mode');
            return res.status(400).json({
                error: 'Invalid Image Format for Live API',
                details: 'The D-ID API requires a publicly accessible image URL (http/https). Handling Base64 images is not supported in this demo setup without a storage bucket. Please use the Demo Mode (remove API key) or provide a public URL.',
                hint: 'Remove DID_API_KEY from .env to test with Demo Mode.'
            });
        }

        // 3. Create the talk
        const createResponse = await axios.post('https://api.d-id.com/talks', {
            script: {
                type: 'text',
                subtitles: 'false',
                provider: { type: 'microsoft', voice_id: voice },
                input: text
            },
            config: { fluent: 'false', pad_audio: '0.0' },
            source_url: imageUrl
        }, {
            headers: {
                'Authorization': `Basic ${DID_API_KEY}`,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        });

        const talkId = createResponse.data.id;
        console.log(`[Video] Talk created with ID: ${talkId}. Polling for completion...`);

        // 4. Poll for completion (timeout after 60 seconds)
        let resultUrl = null;
        const startTime = Date.now();

        while (Date.now() - startTime < 60000) {
            await new Promise(resolve => setTimeout(resolve, 3000));

            const statusResponse = await axios.get(`https://api.d-id.com/talks/${talkId}`, {
                headers: { 'Authorization': `Basic ${DID_API_KEY}` }
            });

            const status = statusResponse.data.status;
            console.log(`[Video] Status for ${talkId}: ${status}`);

            if (status === 'done') {
                resultUrl = statusResponse.data.result_url;
                break;
            } else if (status === 'error') {
                throw new Error('D-ID processing failed');
            }
        }

        if (!resultUrl) {
            throw new Error('Video generation timed out');
        }

        res.json({
            success: true,
            videoUrl: resultUrl,
            message: 'Your custom AI Video is ready!',
            isMock: false,
            type: 'video'
        });

    } catch (error) {
        console.error('Video creation error:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.description || error.message;
        res.status(500).json({
            error: 'AI Video Failure',
            details: errorMessage,
            hint: 'Ensure your D-ID API Key is valid and the image URL is publicly accessible.'
        });
    }
};
