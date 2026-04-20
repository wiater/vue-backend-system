import { controller, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import type { Request, Response } from "express";
import {redisBlackList} from "../../utils/redis.blcaklist"
import { UserService } from "./UserService";
import jwt from 'jsonwebtoken'
import { JWT_REFRESH_SECRET,JWT_ACCESS_SECRET,ACCESS_EXPIRES_IN } from "../../config/jwt.config";
// import { authMiddleware } from "../../middleware/auth.middleware";
@controller("/api/auth")
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  // 登录接口
  @httpPost("/login")
  async login(req: Request, res: Response) {
    
    const name = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "").trim();

    const user = await this.userService.login(name, password);

    if (!user) {
      return res.json({ code: 400, msg: "用户名或密码错误" });
    }
    return res.json({
      code: 200,
      msg:'登录成功',
      data: user
    });
  }

  //登出 
  @httpPost("/logout")
  async logout(req:Request,res:Response) {
    try{
      const refreshToken = String(req.body?.refreshToken || "").trim();
      if(!refreshToken) return res.json({code:400,msg:'refreshToken不能为空'})
      await redisBlackList.add(refreshToken) // 将 refreshToken 加入黑名单
      return res.json({code:200,msg:'退出成功'})
    }catch(err:unknown){
      return res.json({code:500,msg:'退出失败:'+err})
    }
    
  }

  @httpPost('/refresh')
  async refresh(req: Request, res: Response){
     const {refreshToken} = req.body
     if(!refreshToken){
        return res.json({code:401,msg:'refreshToken 不存在'})
     }
    //验证refreshToken 是否有效
    try{
      const decoded = jwt.verify(refreshToken,JWT_REFRESH_SECRET) as jwt.JwtPayload
      //额外校验：防止有人拿accessToken来当refreshToken用
      if(decoded.type !== 'refresh'){
        return res.json({ code: 401, msg: "无效的刷新凭证" });
      }
      //生成新的 accessToken
      const newAccessToken = jwt.sign(
        {id:decoded.id,username:decoded.username,roles:decoded.roles,type:'access'},
        JWT_ACCESS_SECRET,
        {expiresIn:ACCESS_EXPIRES_IN} as jwt.SignOptions)
      return res.json({
        code:200,
        data:{
            accessToken:newAccessToken 
        }
      })
    }catch{
        return res.json({ code: 401, msg: "登录已过期，请重新登录" });
    }
  }


  // 注册接口 → 最终路径：POST /api/auth/register
  @httpPost("/register")
  async register(req: Request, res: Response) {
    const username = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "").trim();

    // 非空校验
    if (!username || !password) {
      return res.json({
        code: 400,
        msg: "用户名和密码不能为空",
      });
    }

    const user = await this.userService.register(username, password);

    if (!user) {
      return res.json({ code: 400, msg: "用户已存在，请更换用户名" });
    }

    return res.json({
      code: 200,
      msg: "注册成功",
      data: null,
    });
  }
}