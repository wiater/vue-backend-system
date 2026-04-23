<template>
  <div class="change-password">
    <h2>修改密码</h2>
      <el-form :rules="rules" ref="passwordFormRef" :model="form">
          <el-form-item label="旧密码 :" prop="oldPassword" label-width="90px">
              <el-input v-model="form.oldPassword" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码 :" prop="newPassword" label-width="90px">
              <el-input v-model="form.newPassword" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码 :" prop="confirmPassword" label-width="90px">
              <el-input v-model="form.confirmPassword" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-button type="primary" @click="handleChange(passwordFormRef)">保存修改</el-button>
      </el-form>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import type { FormInstance,FormRules  } from 'element-plus'
import {ElMessage} from 'element-plus'
import {type FormPassWord} from '@/api/auth'
import {useUserStore} from '@/store/user'
const userStore = useUserStore()
const form = reactive<FormPassWord>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const passwordFormRef = ref<FormInstance>()

const rules = reactive<FormRules<typeof form>>({
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === form.oldPassword) {
          callback(new Error('新密码和旧密码不能一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPassword: [{ required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== form.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
})
const handleChange = async (formEL:FormInstance | undefined) =>{
    if(!formEL) return
    await formEL.validate()
    try{
      await userStore.changePassword(form)
      ElMessage.success('修改密码成功')
    }catch(e){
      ElMessage.error('修改密码失败')
    }
}
</script>

<style scoped lang="scss">
.change-password{
  :deep(.el-form){
     padding: 20px;
     width: 400px;
  }
}
</style>