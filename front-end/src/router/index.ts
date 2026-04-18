import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            redirect: "/home",
        },
        {
            path: "/login",
            component: () => import("@/views/Login.vue"),
        },
    ],
});

export default router;