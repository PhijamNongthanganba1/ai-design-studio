module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // Mock background removal
    // In real app, receive file -> send to Remove.bg API -> return result

    await new Promise(resolve => setTimeout(resolve, 1500));

    res.json({
        success: true,
        // Return a sample transparent image
        image: "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",
        isMock: true
    });
};
