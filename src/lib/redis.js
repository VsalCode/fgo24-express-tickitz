const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB || 0,
});

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
};

const ensureConnection = async () => {
  if (!redisClient.isOpen) {
    await connectRedis();
  }
};

connectRedis().catch(console.error);

module.exports = {
  redisClient,
  connectRedis,
  ensureConnection
};