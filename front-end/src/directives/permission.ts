import type { Directive } from "vue";
import { useUserStore } from "@/store/user";

const permission:Directive = {
    mounted(el,binding){
        const {value} =  binding
        const useStore = useUserStore()
        const hasPermission = useStore.hasRole(value)
        if(!hasPermission){
            el.style.display = 'none'
        }
    }
}

export default permission