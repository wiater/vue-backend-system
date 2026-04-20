import { controller,httpGet } from "inversify-express-utils";
import { authMiddleware } from "../../middleware/auth.middleware";
import type {Request,Response} from "express";
import { prisma } from "../../prisma";

@controller("/api/dashboard", authMiddleware)
export class DashBoardController {
    @httpGet("/overview")
    async getOverviewData(req: Request, res: Response) {
        const [totalUser,totalProduct,adminCount,normalProduct] = await Promise.all([
            prisma.user.count(),
            prisma.product.count(),
            prisma.user.count({where:{roles:{array_contains: ["admin"]}}}),
            prisma.product.count({where:{status:1}})
        ])
        return res.json({code:200,data:{totalUser,totalProduct,adminCount,normalProduct}})
    }
}