<template>
  <div class="layout">
      <header class="layout-header">
          <h2>企业中后台管理系统</h2>
          <div class="header-right">
             <el-button @click="isCollapse = !isCollapse">{{ isCollapse?'展开':'收起' }}</el-button>
             <el-button @click="toggleTheme">{{ isDark ? '浅色' : '深色' }}</el-button>
             <el-button @click="toggleFull">{{ full ? '退出全屏' : '全屏' }}</el-button>
             <el-text style="color: var(--text-normal);">欢迎:{{ userStore.userInfo?.username }}</el-text>
             <el-tag>{{ userStore.userInfo?.roles?.includes('admin')?'管理员':'普通用户' }}</el-tag>
             <el-button @click=logout>退出登录</el-button>
          </div>
      </header>
      <!-- 面包屑 -->
       <div class="breadcrumbList">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(b,i) in breadcrumbList" :key="i"
              @click="i !== breadcrumbList.length-1 && router.push(b.path)"
              :to="{ path:i !== breadcrumbList.length-1 && b.path }">
              {{ b.meta.title}}</el-breadcrumb-item>
          </el-breadcrumb>
       </div>
       <!-- 主体布局 -->
      <div class="layout-main">
        <aside>

            <el-menu
              :default-active="$route.path"
              class="el-menu-vertical-demo"
              :collapse="isCollapse"
              router="true"
            >
              <el-menu-item :index="m.path" v-for="m in menus" :key="m.path">
                  <span>{{m.meta?.title}}</span>
              </el-menu-item>
            </el-menu>
        </aside>
        <main>
          <router-view/>
        </main>
      </div>
  </div>

  
</template>

<script setup lang="ts">
import { ref,computed } from 'vue'
import { useUserStore } from "@/store/user";
import { usePermissionStore } from "@/store/permission";
import { useRoute,useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const permissionStore = usePermissionStore()
const isCollapse = ref(false)

//主题切换
const isDark = ref(localStorage.getItem('theme') === 'dark')
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
if (isDark.value) document.documentElement.classList.add('dark')


//全屏
const full = ref(false)
function toggleFull() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    full.value = true
  } else {
    document.exitFullscreen()
    full.value = false
  }
}



// 菜单权限
const menus = computed(() => {
  return permissionStore.menus.filter(menu=>{
    if(!menu.meta?.roles) return true
    return userStore.hasRole(menu.meta.roles)
  })
})

//面包屑
const breadcrumbList = computed(()=> route.matched.filter(item => item.meta?.title))

//退出登录
const logout = async ()=>{
  try{
    await userStore.logoutWithServer()
    ElMessage.success('退出登录成功')
  }catch(e){
    ElMessage.warning('已退出账号，即将跳转登录页')
  }finally{
    permissionStore.menus = []
    router.push('/login')
  }
  
  
}
</script>

<style scoped lang="scss">
.layout{
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-color);
  header.layout-header{
    height: 60px;
    background: var(--bg-header);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    h2{
      margin: 0;
      font-size: 18px;
    }
    .header-right{
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }
  /**面包屑 */
  .breadcrumbList{
    padding: 10px 20px;
    background: var(--bg-light);
    border-bottom: 1px solid var(--border-light);
    font-size: 14px;
  }
  /**主题布局 */
  .layout-main{
    display: flex;
    flex: 1;
    overflow: hidden;
    aside{
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-light);
      transition: all 0.3s;
      :deep(.el-menu-vertical-demo){
          background: var(--bg-light);
          width: 200px;
          height: 100%;
          padding: 10px;
          margin: 0;
          .el-menu-item{
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            color: var(--text-primary);
            height: 40px;
            background: transparent;
            &.is-active{
              color: #fff;
              background: var(--primary-color);
            }
          }
      }
      :deep(.el-menu--collapse){
        width: 64px;
        .el-menu-item{
          height: 20px;
          &.is-active{
            background: var(--primary-color);
          }
        }
      }
    }
    main{
      flex: 1 1 0%; 
      padding: 20px; 
      overflow-y: auto;
    }
  }
}

</style>