<template>
    <div class="login-register-page">
      <div class="container">
        <div class="title"><h2>企业中后台管理系统</h2></div>
        <!-- Tab 切换 -->
          <el-tabs v-model="activeTab" type="border-card" class="tab-box">
            <!-- 登录 Tab -->
            <el-tab-pane label="登录" name="login">
              <el-form
                  ref="loginRuleFormRef"
                  style=""
                  :model="loginForm"
                  status-icon
                  :rules="loginRules"
                  label-width="auto"
                  class="demo-ruleForm">
                    <el-form-item label="用户名:" prop="username">
                      <el-input v-model="loginForm.username" autocomplete="off"  placeholder="请输入账号" /></el-form-item>
                    <el-form-item label="密码:" prop="password">
                      <el-input
                        v-model="loginForm.password"
                        type="password"
                        autocomplete="off"
                        placeholder="请输入密码"
                      />
                    </el-form-item>
                    <div class="btn-box">
                      <el-button type="primary" @click="login">
                        {{ loading?'登录中':'登录' }}
                      </el-button>
                    </div>
            </el-form>
            </el-tab-pane>

            <!-- 注册 Tab -->
            <el-tab-pane label="注册" name="register">
              <el-form
                  ref="registerRuleFormRef"
                  style=""
                  :model="registerForm"
                  status-icon
                  :rules="registerRules"
                  label-width="auto"
                  class="demo-ruleForm">
                    <el-form-item label="用户名:" prop="username">
                      <el-input v-model="registerForm.username" autocomplete="off"  placeholder="请输入账号" /></el-form-item>
                    <el-form-item label="密码:" prop="password">
                      <el-input
                        v-model="registerForm.password"
                        type="password"
                        autocomplete="off"
                        placeholder="请输入密码"
                      />
                    </el-form-item>
                    <el-form-item label="确认密码:" prop="confirmPwd">
                      <el-input
                        v-model="registerForm.confirmPwd"
                        type="password"
                        autocomplete="off"
                        placeholder="请输入密码"
                      />
                    </el-form-item>
                    <div class="btn-box">
                      <el-button type="primary" @click="register">
                        {{ registerLoading?'注册中':'注册' }}
                      </el-button>
                    </div>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import { ElMessage } from "element-plus";
import type { FormRules } from 'element-plus'
import { loginApi,registerApi } from "@/api/auth";
const router = useRouter()
const userStore = useUserStore ()
const loading = ref(false)
const registerLoading = ref(false)
const activeTab = ref('login')


// =============== 登录 ===============
const loginRuleFormRef = ref()
const loginForm = ref({
   username: "",
   password: "",
});
const loginRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
const login = async () => {
  await loginRuleFormRef.value.validate()
  try{
    loading.value = true
    await loginApi(loginForm.value)
    ElMessage.success('登录成功！')
    router.push('/home')
  }catch(e){
    loading.value = false
    ElMessage.error(String(e))
  }finally{
    loading.value = false
  }
  
}

// =============== 注册 ===============
const registerRuleFormRef = ref()
const registerForm = ref({
   username: "",
   password: "",
   confirmPwd: "",
});
const registerRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPwd: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule: FormRules, value: string, callback: (err?:Error) => void) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
    }
  ]
}
const register = async() => {
  await registerRuleFormRef.value.validate()
  try{
    registerLoading.value = true
    await registerApi(registerForm.value)
    ElMessage.success('注册成功！')
    activeTab.value = 'login'
    router.push('/login')
    loginForm.value = {
      username : registerForm.value.username,
      password : registerForm.value.password
    }
  }catch(e){
    registerLoading.value = false
    ElMessage.error(String(e))
  }finally{
    registerLoading.value = false
  }
  
}
</script>

<style scoped lang="scss">
.login-register-page{
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-light);
  .container{
    width: 400px;
    height: auto;
    background: var(--bg-color);
    padding: 35px 30px;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
    .title{
      text-align: center;
      margin-bottom: 15px;
      color: var(--text-primary);
      h2{
        font-size: 24px;
        font-weight:bold ;
      }
    }
    .tab-box{
      width: 100%;
      :deep(.el-tabs__nav){
        width: 100%;
        .el-tabs__item{
          flex:1;
          text-align: center;
          &:last-child{border-right: none;}
        }
      }
      .btn-box{
        text-align: center;
        margin-top: 10px;
      } 
    }
  }
}
</style>