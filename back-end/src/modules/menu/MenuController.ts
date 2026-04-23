import "reflect-metadata";
import { controller, httpGet,} from "inversify-express-utils";
import type { Request, Response } from "express";
import {menuList} from "@/menu";
import { authMiddleware } from "@/middleware/auth.middleware";

@controller("/api/auth",authMiddleware)
export class MenuController {
  constructor() {}

  // 获取菜单列表
  @httpGet('/menus')
  async getUserMenu(req: Request, res: Response) {
       const userRole = req.user?.roles || [];
       if(userRole.length === 0) return res.json({code:200,data:[]})
       const menus = menuList.filter(menu => {
           return menu.roles.some(role => userRole?.includes(role))
       })
       return res.json({
           code:200,
           msg:'获取菜单成功',
           data:menus
       })
  }

  
}