import "reflect-metadata";
import { controller, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import type { Request, Response } from "express";
import { UserService } from "./UserService";

@controller("/api/auth") // 这里改成正确前缀
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  // 登录接口 → 最终路径：POST /api/auth/login
  @httpPost("/login")
  async login(req: Request, res: Response) {
    
    const name = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "").trim();

    const user = await this.userService.login(name, password);

    if (!user) {
      return res.json({ code: 400, msg: "用户名或密码错误" });
    }
    const {id,username,roles} = user
    return res.json({
      code: 200,
      msg:'登录成功',
      data: {id,username,roles},
    });
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