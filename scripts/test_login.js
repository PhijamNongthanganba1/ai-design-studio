const http = require('http');

const data = JSON.stringify({
    email: 'test@example.com',
    password: 'Password123'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('Response Body:');
        console.log(responseBody);
        try {
            const parsed = JSON.parse(responseBody);
            console.log('Successfully parsed JSON');
        } catch (e) {
            console.log('Failed to parse JSON');
            if (responseBody.startsWith('<!DOCTYPE html>')) {
                console.log('Response is HTML');
            }
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
