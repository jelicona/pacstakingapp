import IORedis from "ioredis";

const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
};

const redisClient = new IORedis(redisConnection);

export { redisConnection, redisClient };
export default redisConnection;
