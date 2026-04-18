import { defineStore } from "pinia";
import type { UserInfo } from "@/types/auth";
export const useUserStore  = defineStore('user',{
    state:() => ({
        token:localStorage.getItem('token') || '',
        refreshToken:localStorage.getItem('refreshToken') || '',
        userInfo:(localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')!):null) as UserInfo | null
    }),
    actions:{
        setToken(token:string){
            this.token = token
            localStorage.setItem('token',token)
        },
        setrefreshToken(token:string){
            this.refreshToken = token
            localStorage.setItem('refreshToken',token)
        },
        setUserInfo(userInfo:UserInfo | null){
            this.userInfo = userInfo
            if(userInfo) localStorage.setItem('userInfo',JSON.stringify(userInfo))
            else localStorage.removeItem('userInfo')
        },

        hasRole(roles:string[]){
            return roles.some(r => this.userInfo?.roles?.includes(r))
        },

        logout(){
            this.token = ''
            this.refreshToken = ''
            this.userInfo = null
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('userInfo')
        }

    }
})