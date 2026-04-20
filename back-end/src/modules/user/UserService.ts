import { injectable } from "inversify";
import { prisma } from "../../prisma";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET,ACCESS_EXPIRES_IN,JWT_REFRESH_SECRET,REFRESH_EXPIRES_IN } from "../../config/jwt.config";
interface User {
    id:number,
    username:string,
    roles:string[]
}
@injectable()
export class UserService{
    constructor(){}
    
    //查看是否存在username
    async findByUsername(username:string){
        return await prisma.user.findUnique({
            where:{username}
        })
    }

    // 生成accessToken
    signAccessToken(userInfo:User) {
        return jwt.sign(
            {id:userInfo.id,username:userInfo.username,roles:userInfo.roles,type:'access'},
            JWT_ACCESS_SECRET,
            {expiresIn:ACCESS_EXPIRES_IN} as jwt.SignOptions
        )
    }
    //生成refreshToken
    signrefreshToken(userInfo:User) {
        return jwt.sign(
            {id:userInfo.id,username:userInfo.username,roles:userInfo.roles,type:'refresh'},
            JWT_REFRESH_SECRET,
            {expiresIn:REFRESH_EXPIRES_IN} as jwt.SignOptions
        )
    }

    //登录
    async login(username:string,password:string){
        const user = await this.findByUsername(username)
        const isMatch = await bcrypt.compare(password,user?.password || '')
        if(!user || !isMatch) return null
        const userInfo = {id:user.id,username:user.username,roles:user.roles as string[]}
        const accessToken = this.signAccessToken(userInfo)
        const refreshToken = this.signrefreshToken(userInfo)
        return {
            userInfo,
            accessToken,
            refreshToken
        }
    }
    
    

    //注册
    async register(username:string,password:string){
        const user = await this.findByUsername(username)
        if(user) return null
        const hashPwd = await bcrypt.hash(password,10)
        return await prisma.user.create({
            data:{
                username,
                password:hashPwd,
                status:1,
                create_time:new Date().toLocaleString(),
                name:username,
                roles:['user']
            }
        })
    }
}