
export interface MenuItem {
    path:string
    name:string
    component?:string
    meta?:{
        title?:string
        roles?:string[]
    }
    children?:MenuItem[]
}