const express = require('express');
const { validateJWT } = require('../middleware/jwtMiddleware.js');
const router = express.Router();

router.get('/', validateJWT, (req, res) => {
    res.json({ "valid": true });
})

module.exports = router;