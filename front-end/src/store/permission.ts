import { defineStore } from "pinia";
import { type MenuItem } from "@/types/menu";

export const usePermissionStore = defineStore('permisson',{
    state:() => ({
        menus:[] as MenuItem[],
    }),
    actions:{
        async fetchMenus (){
             this.menus = await new Promise<MenuItem[]>((resolve) => {
                setTimeout(() => {
                    resolve([
                        { path: '/home', name: 'Home', meta: { title: '首页' } },
                        { path: '/product', name: 'Product', meta: { title: '商品管理',roles: ['admin', 'user'] } },
                        { path: '/user', name: 'User', meta: { title: '用户管理' ,roles: ['admin']}, },
                        { path: '/log', name: 'Log', meta: { title: '日志管理',roles: ['admin'] },},
                        { path: '/chart', name: 'Chart', meta: { title: '图表' } },
                    ]) 
                });
            })
            
        }
    }
})