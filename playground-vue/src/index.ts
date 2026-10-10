import { createApp } from "vue";
import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import { toPageViewRoute } from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import { AppUtils } from "./App/App.utils";
import App from "./App/App.vue";
import AppContent from "./App/AppContent.vue";

const PAGE_ROUTES: RouteRecordRaw[] = AppUtils.COMPONENT_CONFIGS.flatMap((config) => {
    const route = AppUtils.componentToRouteName(config.name);

    return [
        config.component
            ? { path: route, component: config.component }
            : { path: route, redirect: toPageViewRoute(route, "docs") },
        {
            path: toPageViewRoute(route, "docs"),
            component: () => import("./App/PageComponents/DocsView/PageDocsView.vue"),
            props: { name: config.name, description: config.description },
        },
    ];
});

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: AppContent,
            children: [
                { path: "", component: () => import("./App/Pages/AboutPage/AboutPage.vue") },
                {
                    path: "getting-started",
                    component: () => import("./App/Pages/GettingStartedPage/GettingStartedPage.vue"),
                },
                {
                    path: "gallery",
                    component: () => import("./App/Pages/GalleryPage/GalleryPage.vue"),
                    props: { sections: AppUtils.GALLERY_SECTIONS },
                },
                ...PAGE_ROUTES,
            ],
        },
    ],
});

document.documentElement.classList.add(PLAYGROUND_THEMES.vue);

createApp(App).use(router).mount("#root");
