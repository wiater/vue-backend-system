import { controller, httpPost,httpGet,httpPut,httpDelete } from "inversify-express-utils";
import { inject } from "inversify";
import type { Request, Response } from "express";
import { ProductService } from "./ProductService";
import { authMiddleware } from "@/middleware/auth.middleware";
import type { ProductItem } from "./types";
@controller("/api/products",authMiddleware)
export class ProductController {
  constructor(@inject(ProductService) private ProductService: ProductService) {}

  // 商品列表
  @httpGet("/")
  async getProductList(req: Request, res: Response) {
    try{
      const result = await this.ProductService.getProductList(req.query)
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

  
  // 商品详情
  @httpGet("/:id")
  async getProductDetail(req: Request, res: Response) {
      try {
          const result = await this.ProductService.findProductById(req.params.id)
          res.json({code: 200,data: result})
      }catch(err:any){
        return res.status(400).json({
          code:err.code || 400,
          msg:err.msg ||'查询失败',
        })
      }
    }

  // 创建商品
  @httpPost("/")
  async createProduct(req: Request, res: Response) {
    try {
      const data:Omit<ProductItem,'id'> = req.body
      const result = await this.ProductService.createProduct(data)
      return res.json({code:200,msg:'新增成功',data:result})
    }catch(err:any){
      return res.status(400).json({
        code:err.code || 400,
        msg:err.msg ||'新增失败',
      })
    }
    
  }

   // 更新商品
  @httpPut("/:id")
  async updateProduct(req: Request, res: Response) {
      try {
        const result= await this.ProductService.updateProduct(req.body,req.params.id)
        return res.json({code:200,msg:'更新成功',data:result})
      }catch(err:any){
        return res.status(400).json({
          code:err.code || 400,
          msg:err.msg ||'更新失败',
        })
      }
  }

   // 删除商品
  @httpDelete("/:id")
  async deleteProduct(req: Request, res: Response) {
      try {
        const result= await this.ProductService.deleteProduct(req.params.id)
        return res.json({code:200,msg:'删除成功',data:result})
      }catch(err:any){
        return res.status(400).json({
          code:err.code || 400,
          msg:err.msg ||'删除失败',
        })
      }
  }

   // 批量删除商品
  @httpPost("/batch-delete")
  async batchDeleteProduct(req: Request, res: Response) {
      try {
        const result= await this.ProductService.batchDeleteProduct(req.body.ids)
        return res.json({code:200,msg:'删除成功',data:result})
      }catch(err:any){
        return res.status(400).json({
          code:err.code || 400,
          msg:err.msg ||'删除失败',
        })
      }
    
    
  }

  
}