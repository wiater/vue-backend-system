import {controller,httpGet as Get,httpPost as Post} from "inversify-express-utils";
import {inject} from "inversify";
import type {Request,Response} from "express";
import {LogService} from "./LogService";
import {authMiddleware} from "@/middleware/auth.middleware";
@controller("/api/logs",authMiddleware)
export class LogController{
    constructor(@inject(LogService) private logService:LogService){}
    @Get("/")
    async getLogs(req:Request,res:Response){
        try{
            const result = await this.logService.getLogs()
            res.json({
                code:200,
                data:result
            })
        }catch(error:any){
            res.json({
                code:error.code || 400,
                msg:error.msg
            })
        }
        
    }

    @Post("/")
    async createLogs(req:Request,res:Response){
        try{
            const {content} = req.body
            const user = req.user?.username || 'unknown'
            const result = await this.logService.createLogs(user,content)
            res.json({
                code:200,
                data:result
            })
        }catch(error:any){
            res.json({
                code:error.code || 400,
                msg:error.msg
            })
        }
        
    }
}