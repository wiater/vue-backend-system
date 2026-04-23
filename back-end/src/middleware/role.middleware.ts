import type { Response, NextFunction} from 'express';
import type {AuthRequest} from './auth.middleware';

//角色鉴权中间件
export  function roleMiddleware(allowRoles:string[]){
    return  (req:AuthRequest,res:Response,next:NextFunction) => {
        const user = req.user

        //没登录
        if(!user){
            return res.status(401).json({code:401,msg:'请先登录'})
        }

        //判断角色是否在允许列表里
        const hasPermission  = user.roles.some((role:string)=>allowRoles.includes(role))
        if(!hasPermission ){
            return res.status(403).json({
                code:403,
                msg:'无权限访问'
            })
        }
        next()
    }

}