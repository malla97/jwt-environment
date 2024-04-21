const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

// load SSL certificate and private key
const options = {
    key: fs.readFileSync('../private.pem'),
    cert: fs.readFileSync('../cert.pem')
};

// endpoint to serve the cert.pem file
app.get('/cert.pem', (req, res) => {
  // Read the cert.pem file and send it as the response
  const cert = fs.readFileSync('../cert.pem', 'utf8');
  res.type('application/pkix-cert').send(cert);
});

// create HTTPS server
const server = https.createServer(options, app);

// start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
