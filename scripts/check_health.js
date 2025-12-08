const http = require('http');

http.get('http://localhost:3001/api/health', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        console.log('Status Code:', resp.statusCode);
        console.log('Response:', data);
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
