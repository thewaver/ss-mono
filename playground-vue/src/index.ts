import { createApp } from "vue";
import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import { MENU_DESCRIPTIONS } from "@thewaver/ss-playground/App/MenuDescriptions.const";
import { NavSettingsUtils } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.utils";
import { toPageViewRoute } from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";
import { PLAYGROUND_SKINS } from "@thewaver/ss-playground/App/Skins/Skin.const";
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
            component: () => import("./App/DocsRoute.vue"),
            props: { description: MENU_DESCRIPTIONS[config.name], docs: config.docs },
        },
        {
            path: toPageViewRoute(route, "api"),
            component: () => import("./App/PageComponents/ApiView/PageApiView.vue"),
            props: { name: config.name },
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
                {
                    path: "appearance",
                    component: () => import("./App/Pages/AppearancePage/AppearancePage.vue"),
                },
                ...PAGE_ROUTES,
            ],
        },
    ],
});

document.documentElement.classList.add(PLAYGROUND_THEMES[NavSettingsUtils.loadTheme()]);
document.documentElement.classList.add(PLAYGROUND_SKINS[NavSettingsUtils.loadSkin()]);

createApp(App).use(router).mount("#root");
