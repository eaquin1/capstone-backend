const redis = require("redis");

const REDIS_URL = process.env.REDIS_URL || 6379;

const redis_client = redis.createClient(REDIS_URL);

module.exports = redis_client;
