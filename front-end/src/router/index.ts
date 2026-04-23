import { createRouter, createWebHistory } from "vue-router";
// import type { Component } from "vue";
import type {MenuItem  } from "@/types/menu";
import { useUserStore } from "@/store/user";
import { usePermissionStore } from "@/store/permission";
const Layout = () => import('@/views/Layout.vue')
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
        return {
            path:menu.path,
            name:menu.name,
            component:() => import(`@/views/${menu.name}.vue`),
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
    if(!userStore.accessToken){
        //在登录界面就不动
        if(to.path === '/login')  next()
        //不在登录界面就记录下想去的path，然后跳转登录界面
        localStorage.setItem('redirectPath',to.fullPath)
        next('/login')
    }

    //登录
    if(to.path === '/login')  next ('/home')
    const permissionStore = usePermissionStore()
    if(!permissionStore.menus.length){
        try{
            await permissionStore.fetchMenus()
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