import type { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config/jwt.config";
import {redisBlackList} from "../utils/redis.blcaklist";

export async function authMiddleware(req: Request & { user?: any }, res: Response, next: NextFunction) {
    //从请求头取出token
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({code:401,msg:'请先登录'})
    }
    //截取token
    const token = authHeader.split(' ')[1]

    if(!token) return res.sendStatus(401)
    try {
        // 检查是否被登出拉黑
        const exists = await redisBlackList.check(token)
        if(exists) return res.status(401).json({code:401,msg:'登录已过期，请重新登录'})
        // 验证 token 是否合法 没过期
        const decoded = jwt.verify(token,JWT_ACCESS_SECRET)
        req.user = decoded  // 保存用户信息
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({code:401,msg:'登录已过期，请重新登录'})
    }
}