import { createClient } from 'redis';

const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
});

export async function connect() {
  return redisClient.connect();
}

export function set(key, value, options) {
  return redisClient.set(key, value, options);
}
export function get(key) {
  return redisClient.get(key);
}

export async function saveData() {
  console.log('Saving Redis data to disk...');
  await redisClient.save();
  console.log('Redis data saved successfully.');
}