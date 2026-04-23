import axios from "axios";
import {type AxiosResponse  } from "axios";
import { useUserStore } from "@/store/user";
const request = axios.create({
    baseURL:'/api',
    timeout:10000
})

interface ApiResponse<T = unknown> {
    code: number
    message: string
    data: T
}
//获取错误信息
function getErrorMessage(err: unknown): string {
  const maybeErr = err as {
    message?: string
    response?: { data?: { message?: string } }
  }
  const data = maybeErr.response?.data
  if (data?.message) return String(data.message)
  if (maybeErr.message) return String(maybeErr.message)
  return '请求失败'
}
let refreshTokenTask: Promise<string> | null = null
//请求拦截器：自动携带token
request.interceptors.request.use(config => {
    const userStore = useUserStore()
    if(userStore.accessToken){
        config.headers.Authorization = `Bearer ${userStore.accessToken}`
    }
    return config
})

// 响应拦截器：自动解套axios外层data 
request.interceptors.response.use((res):AxiosResponse => {
    const payload = res.data as ApiResponse & {msg:string}
    payload.message = payload.msg
    if(payload?.code === 200) return payload.data as unknown as AxiosResponse
    throw new Error(payload?.message || '请求失败')},
    async(error) => {
        const userStore = useUserStore()
        const originalRequest = error.config;
        //如果是401 且 未重试
        if(error.response.status === 401 && !originalRequest._retry && userStore.refreshToken){
            originalRequest._retry = true;
            try{
                //并发请求共享一个刷新任务，避免重复刷新
                if(!refreshTokenTask) refreshTokenTask = userStore.refreshAccessToken()
                const newToken = await refreshTokenTask
                // 把新token带上，重新发刚才失败的请求
                originalRequest.headers = originalRequest.headers || {}
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return request(originalRequest)
            }catch{
                //刷新也失败，跳登录
                userStore.logout()
                // window.location.reload()
                return Promise.reject(error)
            }finally{
                refreshTokenTask = null
            }
        }
        if(error.response.status === 401){
            // 没有 refreshToken 或刷新后仍失败时，兜底清理会话并回到登录页
            userStore.logout()
            // window.location.reload()
        }
        return Promise.reject(new Error(getErrorMessage(error)))
    }
)

export default request