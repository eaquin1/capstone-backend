const jwt = require("jsonwebtoken");
require("dotenv/config");
const JWT_SECRET = process.env.JWT_SECRET;

/** return signed JWT from user data. */

function createToken(user) {
    let payload = {
        user: user.dexcom_id,
    };

    return jwt.sign(payload, JWT_SECRET);
}

module.exports = createToken;
