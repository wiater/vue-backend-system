import { createLog } from "@/api/log";
import { computed } from "vue";
import { useUserStore } from "@/store/user";
const userStore = useUserStore()
export async function  useWriteLog(content:string){
    const currentUserName = computed(()=>userStore.userInfo?.username || 'unknown')
    try{
        await createLog(currentUserName.value,content)
    }catch{
        
    }
}