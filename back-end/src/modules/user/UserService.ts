import { injectable } from "inversify";
import { prisma } from "../../prisma";
import bcrypt from 'bcrypt'
@injectable()
export class UserService{
    constructor(){}

    //查看是否存在username
    async findByUsername(username:string){
        return await prisma.user.findUnique({
            where:{username}
        })
    }

    //登录
    async login(username:string,password:string){
        const user = await this.findByUsername(username)
        const isMatch = await bcrypt.compare(password,user?.password || '')
        if(!user || !isMatch) return null
        return user
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
                create_time:new Date(),
                name:username,
                roles:['user']
            }
        })
    }
}