export interface UserInfo {
    id:number,
    username:string,
    roles:string[]
}

export interface LoginResult {
    accessToken:string,
    refreshToken:string
    userInfo:UserInfo
}

export interface LoginPayload {
    username:string,
    password:string
}

export interface RegisterPayload {
    username:string,
    password:string,
    name?:string
}