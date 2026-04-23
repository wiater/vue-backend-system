import { defineStore } from "pinia";
import { type MenuItem } from "@/types/menu";
import { fetchMenusApi } from "@/api/menu";

export const usePermissionStore = defineStore('permisson',{
    state:() => ({
        menus:[] as MenuItem[],
    }),
    actions:{
        async fetchMenus (){
             this.menus = await fetchMenusApi()
        }
    }
})