import request from "./request";
import { type LoginPayload,type RegisterPayload } from "../types/auth";
//登录
export async function loginApi(payLoad:LoginPayload){
    return request.post('/auth/login',payLoad) as Promise<LoginPayload>
}

//登录
export async function registerApi(payLoad:RegisterPayload){
    return request.post('auth/register',payLoad) as Promise<RegisterPayload>
}