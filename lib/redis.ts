import { Redis } from "@upstash/redis";

export const redis = (() => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    console.warn("Redis env not set, using mock in-memory");
    return null as any;
  }
  return new Redis({ url, token });
})();

// Helper fallback mock
export const isRedisReady = () => !!redis;
