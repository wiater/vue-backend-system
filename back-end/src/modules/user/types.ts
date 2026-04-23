

export interface UserItem {
    id: number;
    username: string;
    password:string;
    name:string;
    role: string;
    status: 0 | 1;
    create_time: string;
}

export interface UserQuery {
    pageNum: number;
    pageSize: number;
    username?: string;
    role?:string;
    status?: number | null;
}

export interface UserPageResult {
    list: UserItem[];
    total: number;
}
