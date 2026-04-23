import { defineStore } from "pinia";
import type { UserInfo } from "@/types/auth";
import { loginApi,logoutApi,refreshToken,type FormPassWord,changePasswordApi } from "@/api/auth";
export const useUserStore  = defineStore('user',{
    state:() => ({
        accessToken:localStorage.getItem('accessToken') || '',
        refreshToken:localStorage.getItem('refreshToken') || '',
        userInfo:(localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')!):null) as UserInfo | null
    }),
    actions:{
        setaccessToken(accessToken:string){
            this.accessToken = accessToken
            localStorage.setItem('accessToken',accessToken)
        },
        setrefreshToken(refreshToken:string){
            this.refreshToken = refreshToken
            localStorage.setItem('refreshToken',refreshToken)
        },
        setUserInfo(userInfo:UserInfo | null){
            this.userInfo = userInfo
            if(userInfo) localStorage.setItem('userInfo',JSON.stringify(userInfo))
            else localStorage.removeItem('userInfo')
        },

        //登录后保存accessToken refreshToken 用户信息
        async login(payload:{username:string,password:string}){
            const data = await loginApi(payload)
            this.setaccessToken(data.accessToken)
            this.setrefreshToken(data.refreshToken)
            this.setUserInfo(data.userInfo)
        },

        // accessToken 过期时，用 refreshToken 换新 token
        async refreshAccessToken(){
            if(!this.refreshToken) throw new Error('缺少 refreshToken')
            const data = await refreshToken(this.refreshToken)
            this.setaccessToken(data.accessToken)
            return data.accessToken
        },

        //通知后端失效 accesToken  ,再清理本地会话
        async logoutWithServer(){
            const currentRefreshToken  = this.refreshToken;
            try{
                if(currentRefreshToken) await logoutApi(currentRefreshToken)
            }finally{
                this.logout()
            }
        },

        //修改密码
        async changePassword(payload:FormPassWord){
            return changePasswordApi(payload,this.accessToken)
        },

        hasRole(roles:string[]){
            return roles.some(r => this.userInfo?.roles?.includes(r))
        },
        

        logout(){
            this.accessToken = ''
            this.refreshToken = ''
            this.userInfo = null
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('userInfo')
        }

    }
})