
import { createApp } from 'vue'
import router from './router'
import { createPinia } from "pinia";
import './style.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn' 
import App from './App.vue'
import permission from '@/directives/permission'
const app = createApp(App)
app.use(router) 
app.use(createPinia())
app.use(ElementPlus, { locale: zhCn })
app.directive('permission',permission)
app.mount('#app')
