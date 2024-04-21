const https = require('https');
const pem = require('pem');
const fs = require('fs')

function fetchCertificate(url) {
    // trust the created cert.pem certificate
    const caCert = fs.readFileSync('../cert.pem');
    const httpsOptions = {
        ca: caCert
    };

    return new Promise((resolve, reject) => {
        https.get(url, httpsOptions, (res) => {
            let certData = '';
            res.on('data', (chunk) => {
                certData += chunk;
            });
            res.on('end', () => {
                // extract the public key from the certificate data
                pem.getPublicKey(certData, (err, publicKey) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(publicKey);
                    }
                });
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

module.exports = {
    fetchCertificate
};