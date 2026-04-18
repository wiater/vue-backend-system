import { createRouter, createWebHistory } from "vue-router";
import type { Component } from "vue";
import type {MenuItem  } from "@/types/menu";
import { useUserStore } from "@/store/user";
import { usePermissionStore } from "@/store/permission";
const Layout = () => import('@/views/Layout.vue')
const Home = () => import('@/views/Home.vue')
const Product = () => import('@/views/ProductList.vue')
const User = () => import('@/views/User.vue')
const Profile = () => import('@/views/Profile.vue')
const Editor = () => import('@/views/Editor.vue')
const ResetPwd = () => import('@/views/ResetPwd.vue')
const Log = () => import('@/views/Log.vue')
const Chart = () => import('@/views/Chart.vue')
const NotFound = () => import('@/views/NotFound.vue')
const Login = () => import('@/views/Login.vue')
const constantRoutes = [
    { path: '/login', name: 'Login', component: Login },
    { path: '/404', name: 'NotFound', component: NotFound }
]
const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes
});

//动态添加路由
export function addDynamicRoutes(menus:MenuItem[]){
    const routes = menus.map(menu => {
        const compMap:Record<string,()=>Promise<Component>> = {
            Home,
            Product,
            User,
            Profile,
            Editor,
            ResetPwd,
            Log,
            Chart
        }
        return {
            path:menu.path,
            name:menu.name,
            component:compMap[menu.name!] || Home,
            meta:menu.meta
        }
    })
    router.addRoute({
        path:'/',
        component:Layout,
        children:routes
    })
    router.addRoute({
        path:'/:pathMatch(.*)*',
        redirect:'/404'
    })
}


//路由守卫
router.beforeEach(async (to,_from,next) => {
    const userStore = useUserStore()
    //未登录
    if(!userStore.token){
        //在登录界面就不动
        if(to.path === '/login') return next()
        //不在登录界面就记录下想去的path，然后跳转登录界面
        localStorage.setItem('redirectPath',to.fullPath)
        next('/login')
    }

    //登录
    if(to.path === '/login') return next ('/home')
    const permissionStore = usePermissionStore()
    if(!permissionStore.menus.length){
        try{
            await permissionStore.fetchMenus()
            console.log(permissionStore.menus)
            addDynamicRoutes(permissionStore.menus)
            next(to.fullPath)
        }catch{
            userStore.logout()
            next('/login')
        }
    }
    if(to.meta?.roles && !userStore.hasRole(to.meta.roles as string [])){
         next ('/home')
    }

    next()

})

export default router;