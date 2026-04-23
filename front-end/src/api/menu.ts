import request from './request'
import type { MenuItem} from '@/types/menu'
//获取菜单权限列表
export const fetchMenusApi = () => request.get('/auth/menus') as Promise<MenuItem[]>