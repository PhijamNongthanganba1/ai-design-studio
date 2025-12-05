module.exports = async (req, res) => {
    res.status(200).json({
        status: 'ok',
        endpoints: ['/api/login', '/api/signup', '/api/generate-image', '/api/health'],
        timestamp: new Date().toISOString()
    });
};
