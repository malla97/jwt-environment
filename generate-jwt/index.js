const jwt = require('jsonwebtoken');
const fs = require('fs');

// create a sample payload
const payload = {
    sub: '0987654321',
    name: 'John Doe',
    iat: Math.floor(Date.now() / 1000), // issued at current time
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365), // expiration time 1 year from now
};

// load private key
const privateKey = fs.readFileSync('../private.pem', 'utf8');

// create JWT token
const token = jwt.sign(payload, privateKey, {
    header: {
        "alg": "RS256",
        "typ": "JWT",
        "x5u": "https://localhost:3000/cert.pem"
    }
});

console.log('JWT token:', token);