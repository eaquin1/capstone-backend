const redis = require("redis");

const REDIS_PORT = process.env.REDIS_URL || 6379;

const redis_client = redis.createClient(REDIS_PORT);

module.exports = redis_client;
