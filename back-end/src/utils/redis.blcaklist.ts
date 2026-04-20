// import { Redis } from "ioredis";
// import {ACCESS_EXPIRES_IN_SECONDS} from "../config/jwt.config";

// 连接本地 redis
// export const redis = new Redis({
//     host: '127.0.0.1',
//     port: 6379
// })

// // redis 黑名单
// export class RedisBlackList {
//     private redis: Redis
//     constructor(redis: Redis) {
//         this.redis = redis
//     }

//     async add(key: string) {
//         await this.redis.set(key, '1', 'EX', ACCESS_EXPIRES_IN_SECONDS)
//     }

//     async check(key: string) {
//         return await this.redis.exists(key)
//     }
// }

// //导出实例
// export const redisBlackList = new RedisBlackList(redis)
//  用内存 Set 代替 Redis
const tokenBlacklist = new Set<string>();

// redis 黑名单（模拟版，不连Redis）
export class RedisBlackList {
  // private redis: Redis   
  constructor() {}

  async add(key: string) {
    tokenBlacklist.add(key); // 用内存存
  }

  async check(key: string) {
    return tokenBlacklist.has(key) ? 1 : 0;
  }
}

// 导出实例（不变）
export const redisBlackList = new RedisBlackList();