import request from "./request";

export interface ActionLog {
    id:number
    user:string
    content:string
    time:string
}

//获取日志
export async function getLogs(){
    const res = await request.get('/logs') as ActionLog[]
    return res || []
}

//创建日志
export async function createLog(user:string,content:string){
    return request.post('/logs',{user,content})
}