const jwt = require('jsonwebtoken');
const certUtils = require('../utils/certUtils');


exports.validateJWT = async (req, res, next) => {
    const authToken = req.headers['authorization'];

    if (!authToken) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // remove Bearer from token
    const token = authToken.split(' ')[1];
    try {
        const decodedToken = jwt.decode(token, { complete: true });

        // check that the format is correct, i.e. the jwt has a header
        // a payload and a signature. Because the decode uses complete: true
        // the decodedToken would be null, if it was missing a header, payload, 
        // or siganture
        if (!decodedToken) {
            throw new Error('Invalid token format');
        }

        // check that the header contains x5u parameter
        if (!decodedToken.header.x5u) {
            throw new Error('JWT header missing the x5u parameter')
        }

        // check issue and expiration times validity
        const { iat, exp } = decodedToken.payload;
        const currentTime = Math.floor(Date.now() / 1000);
        if (iat >= currentTime) {
            throw new Error('Invalid JWT issue time');
        }
        if (exp <= currentTime) {
            throw new Error('JWT has expired');
        }

        const certUrl = decodedToken.header.x5u;
        // fetch x.509 certificate and extract public key
        const cert = await certUtils.fetchCertificate(certUrl);
        const publicKey = cert.publicKey;

        // validate signature using the public key and that it was signed using
        // RS256 algorithm
        jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid JWT signature' });
            }
        });

        console.log("JWT is valid");
        next();

    } catch (error) {
        console.error('Error validating token:', error.message);
        res.status(401).json({ valid: false, message: error.message });
    }
}
