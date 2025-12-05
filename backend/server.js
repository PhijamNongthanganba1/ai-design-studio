const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory user storage (for local testing - in production use MongoDB)
const users = {};

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
});

// Hash password
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// ============================================
// AUTH ENDPOINTS
// ============================================

// Signup
app.post('/api/signup', (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }

    const emailLower = email.toLowerCase();
    if (users[emailLower]) {
        return res.status(409).json({ error: 'Email already exists' });
    }

    users[emailLower] = {
        email: emailLower,
        password: hashPassword(password),
        name: name || 'User',
        plan: 'free',
        createdAt: new Date().toISOString()
    };

    res.json({
        success: true,
        message: 'User created successfully!',
        user: {
            email: emailLower,
            name: name || 'User',
            plan: 'free'
        }
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }

    const emailLower = email.toLowerCase();
    const user = users[emailLower];

    if (user && user.password === hashPassword(password)) {
        res.json({
            success: true,
            user: {
                email: user.email,
                name: user.name,
                plan: user.plan
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid email or password' });
    }
});

// ============================================
// AI IMAGE GENERATION (Pollinations.ai - FREE)
// ============================================
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt, style, width, height } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log('🎨 Generating AI image:', prompt);

        const encodedPrompt = encodeURIComponent(prompt + ' ' + (style || ''));
        const aiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width || 1024}&height=${height || 1024}&nologo=true`;

        const imageResponse = await axios.get(aiUrl, {
            responseType: 'arraybuffer',
            timeout: 60000
        });

        const base64 = Buffer.from(imageResponse.data).toString('base64');

        console.log('✅ Image generated successfully');
        res.json({
            success: true,
            image: `data:image/jpeg;base64,${base64}`,
            message: 'Generated using Free AI (Pollinations.ai)'
        });
    } catch (error) {
        console.error('❌ Image generation error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Image generation failed: ' + error.message
        });
    }
});

// ============================================
// BACKGROUND REMOVAL (Returns original for now)
// ============================================
app.post('/api/remove-background', express.raw({ type: 'application/octet-stream', limit: '50mb' }), (req, res) => {
    console.log('🔧 Background removal requested (returning original)');
    res.json({
        success: true,
        message: 'Background removal - use external service for production',
        isMock: true
    });
});

// ============================================
// AI CONTENT GENERATION
// ============================================
app.post('/api/generate-content', (req, res) => {
    const { type, context } = req.body;

    let content = '';
    if (type === 'resume') {
        const templates = [
            "Results-driven professional with proven expertise in delivering high-impact solutions. Strong analytical and problem-solving skills combined with excellent communication abilities.",
            "Accomplished professional with a track record of exceeding expectations. Skilled in strategic planning, team leadership, and driving operational excellence.",
            "Dynamic and innovative professional with extensive experience in project management and cross-functional collaboration."
        ];
        content = templates[Math.floor(Math.random() * templates.length)];
    } else {
        content = "Professional design suggestion: Consider using complementary colors and maintaining consistent spacing for a polished look.";
    }

    res.json({
        success: true,
        content: content,
        message: 'Generated using templates'
    });
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        platform: 'Local Development',
        features: {
            auth: true,
            imageGeneration: true,
            database: 'In-Memory'
        },
        timestamp: new Date().toISOString()
    });
});

// Start Server
app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ═══════════════════════════════════════════════');
    console.log('   AI Design Studio Backend Running!');
    console.log('═══════════════════════════════════════════════════');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`🏠 App:    http://localhost:${PORT}/`);
    console.log(`💚 Health: http://localhost:${PORT}/api/health`);
    console.log('═══════════════════════════════════════════════════');
    console.log('');
});
