/** Database setup for Dexcom API users. */
const { Client } = require("pg");

const DB_URI = (process.env.NODE_ENV === "test")
  ? "postgresql:///dexcom_test"
  : "postgresql:///dexcom";

let db = new Client({
  connectionString: DB_URI
});

db.connect();

module.exports = db;