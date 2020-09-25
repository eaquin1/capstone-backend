/** Shared config for application; can be req'd many places. */

require("dotenv").config();

// const SECRET = process.env.SECRET_KEY || 'test';

let PORT = +process.env.PORT || 5000;

// database is:
//
// - on Heroku, get from env var DATABASE_URL
// - in testing, 'dexcom-test'
// - else: 'dexcom'
let DB_URI;
if (process.env.NODE_ENV === "test") {
    DB_URI = "postgresql:///dexcom-test";
} else {
    DB_URI = process.env.DATABASE_URL || "postgresql:///dexcom";
}

console.log("Using database", DB_URI);

module.exports = {
    PORT,
    DB_URI,
};
