export interface UserItem {
    id:number
    username:string
    nickname:string
    role:'admin' | 'user'
    status: 0 | 1
    createTime:string
}

export interface UserQuery {
    pageNum:number
    pageSize:number
    username?:string
    role?:'' | 'admin' | 'user'
    status?:number | null
}