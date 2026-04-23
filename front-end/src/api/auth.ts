import request from "./request";
import type { LoginResult,LoginPayload, RegisterPayload } from "../types/auth";

export interface FormPassWord {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string
}

//登录
export async function loginApi(payLoad:LoginPayload){
    return request.post('/auth/login',payLoad) as Promise<LoginResult>
}

//注册
export async function registerApi(payLoad:RegisterPayload){
    return request.post('/auth/register',payLoad) as Promise<null>
}

//刷新token
export async function refreshToken(refreshToken:string){
    return request.post('/auth/refresh',{refreshToken}) as Promise<{accessToken:string}>
}

//登出
export async function logoutApi(refreshToken:string){
    return request.post('/auth/logout',{refreshToken}) as Promise<null>
}

// 修改密码
export async function changePasswordApi(form:FormPassWord,accessToken:string) {
    return request.post('/auth/password', { form,accessToken})
}