import { controller, httpPost,httpGet,httpPut,httpDelete } from "inversify-express-utils";
import { inject } from "inversify";
import type { Request, Response } from "express";
import { UserService } from "./UserService";
import { authMiddleware } from "@/middleware/auth.middleware";
import { roleMiddleware } from "@/middleware/role.middleware";
import type { UserItem} from "./types";
@controller("/api/Users",authMiddleware)
export class UserController {
  constructor(@inject(UserService) private UserService: UserService) {}

  // 用户列表
  @httpGet("/", roleMiddleware(['admin','user']))
  async getUserList(req: Request, res: Response) {
    try{
      const result = await this.UserService.getUserList(req.query)
      return res.json({
        code: 200,
        data: result
      })
    }
    catch(err:any){
      return res.status(400).json({
        code:err.code || 400,
        msg:err.msg ||'查询失败',
      })
    }
  }

  
  // 用户详情
  @httpGet("/:id")
  async getUserDetail(req: Request, res: Response) {
      try {
          const result = await this.UserService.findUserById(req.params.id)
          res.json({code: 200,data: result})
      }catch(err:any){
        return res.status(400).json({
          code:err.code || 400,
          msg:err.msg ||'查询失败',
        })
      }
    }

  // 创建用户
  @httpPost("/", roleMiddleware(['admin']))
  async createUser(req: Request, res: Response) {
    try {
      const data:Omit<UserItem,'id'> = req.body
      const result = await this.UserService.createUser(data)
      return res.json({code:200,msg:'新增成功',data:result})
    }catch(err:any){
      return res.status(400).json({
        code:err.code || 400,
        msg:err.msg ||'新增失败',
      })
    }
    
  }

   // 更新用户
  @httpPut("/:id", roleMiddleware(['admin']))
  async updateUser(req: Request, res: Response) {
      try {
        const result= await this.UserService.updateUser(req.body,req.params.id)
        return res.json({code:200,msg:'更新成功',data:result})
      }catch(err:any){
        return res.status(400).json({
          code:err.code || 400,
          msg:err.msg ||'更新失败',
        })
      }
  }

   // 删除用户
  @httpDelete("/:id", roleMiddleware(['admin']))
  async deleteUser(req: Request, res: Response) {
      try {
        const result= await this.UserService.deleteUser(req.params.id)
        return res.json({code:200,msg:'删除成功',data:result})
      }catch(err:any){
        return res.status(400).json({
          code:err.code || 400,
          msg:err.msg ||'删除失败',
        })
      }
  }

   // 批量删除用户
  @httpPost("/batch-delete", roleMiddleware(['admin']))
  async batchDeleteUser(req: Request, res: Response) {
      try {
        const result= await this.UserService.batchDeleteUser(req.body.ids)
        return res.json({code:200,msg:'删除成功',data:result})
      }catch(err:any){
        return res.status(400).json({
          code:err.code || 400,
          msg:err.msg ||'删除失败',
        })
      }
  }


  
}