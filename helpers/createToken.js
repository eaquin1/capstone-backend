require("dotenv/config");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

/** return signed JWT from user data. */

function createToken(sessionId) {
    console.log("secret", SECRET);
    let payload = {
        user: sessionId,
    };

    return jwt.sign(payload, SECRET);
}

module.exports = createToken;
