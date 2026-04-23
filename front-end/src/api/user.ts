import request from "./request";

export interface UserItem {
    id: number;
    username: string;
    password:string
    name:string
    role: 'admin' | 'user';
    roles?: ['admin' | 'user'];
    status: 0 | 1;
    create_time: string;
}

export interface UserQuery {
    pageNum: number;
    pageSize: number;
    username?: string;
    role?:'admin' | 'user';
    status?: number | null;
}

export interface UserPageResult {
    list: UserItem[];
    total: number;
}




// 获取用户列表
export async function getUserListApi(params: UserQuery): Promise<UserPageResult> {
    const res = await request.get('/Users', { params }) as UserPageResult
    return {
        list: res?.list || [],
        total: Number(res?.total || 0),
    }
}

// 获取用户详情
export async function getUserDetailApi(id: number) {
    return request.get(`/Users/${id}`)
}

// 创建用户
export async function createUserApi(data: Omit<UserItem, 'id'>) {
    return request.post('/Users', data)
}

// 更新用户
export async function updateUserApi(data: UserItem) {
    return request.put(`/Users/${data.id}`, data)
}

// 删除用户
export async function deleteUserApi(id: number) {
    return request.delete(`/Users/${id}`)
}

// 批量删除用户
export async function batchDeleteUserApi(ids: number[]) {
    return request.post('/Users/batch-delete', { ids })
}

