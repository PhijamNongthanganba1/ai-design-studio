require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, '.')));

// API Routes Adapter
const apiAdapter = (handler) => async (req, res) => {
    try {
        await handler(req, res);
    } catch (err) {
        console.error('API Error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

// Mount API Endpoints
app.post('/api/login', apiAdapter(require('./api/login.js')));
app.post('/api/signup', apiAdapter(require('./api/signup.js')));
app.post('/api/generate-image', apiAdapter(require('./api/generate-image.js')));
app.post('/api/remove-background', apiAdapter(require('./api/remove-background.js')));
app.get('/api/health', apiAdapter(require('./api/health.js')));

// Catch-all for basic routing
// Using app.use instead of app.get('*') for compatibility
app.use((req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.status(404).json({ error: 'Endpoint not found' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running locally at http://localhost:${PORT}`);
    console.log(`   - Static files served from root`);
    console.log(`   - APIs mounted at /api/*`);
});
