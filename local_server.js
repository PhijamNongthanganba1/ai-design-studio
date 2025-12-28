require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Warning if MONGODB_URI is missing
if (!process.env.MONGODB_URI) {
    console.warn('⚠️  WARNING: MONGODB_URI is not set in .env file.');
    console.warn('   Database features (login/signup) will fail.');
}

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Request Logging
app.use((req, res, next) => {
    if (req.method !== 'OPTIONS') {
        console.log(`[${req.method}] ${req.url}`);
    }
    next();
});

// Security/CORS Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// 1. Dynamic API Mounting (Simulates Vercel /api/*.js)
const apiDir = path.join(__dirname, 'api');
if (fs.existsSync(apiDir)) {
    fs.readdirSync(apiDir).forEach(file => {
        if (file.endsWith('.js')) {
            const routeName = `/api/${file.replace('.js', '')}`;
            const handler = require(path.join(apiDir, file));

            app.post(routeName, async (req, res) => {
                try {
                    await handler(req, res);
                } catch (err) {
                    console.error(`Error in ${routeName}:`, err);
                    if (!res.headersSent) res.status(500).json({ error: 'Internal Server Error' });
                }
            });

            // Some might be GET (like /api/health)
            if (file === 'health.js') {
                app.get(routeName, async (req, res) => {
                    try { await handler(req, res); } catch (err) { res.status(500).send('Error'); }
                });
            }
        }
    });
    console.log(`🚀 Mounted APIs from /api folder`);
}

// 2. Vercel-style Rewrites
const rewrites = [
    { source: '/login', dest: 'public/login.html' },
    { source: '/signup', dest: 'public/signup.html' },
    { source: '/dashboard', dest: 'public/dashboard.html' },
    { source: '/app', dest: 'public/studio.html' }
];

rewrites.forEach(rw => {
    app.get(rw.source, (req, res) => res.sendFile(path.join(__dirname, rw.dest)));
});

// 3. Static Files (Public folder)
app.use(express.static(path.join(__dirname, 'public')));

// 4. Fallback Routing
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    // Default to login page
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.listen(PORT, () => {
    console.log(`\n✅ Server is running!`);
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
    console.log(`📂 Static files: Serving from root`);
    console.log(`🛠️  API routes: Active at /api/*`);
    console.log(`\nPress Ctrl+C to stop the server.\n`);
});

