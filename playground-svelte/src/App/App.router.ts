import type { Routes } from "sv-router";
import { createRouter } from "sv-router";

import { toRouterBase } from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/FrameworkSwitch.const";
import { toPageViewRoute } from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";
import { StringUtils } from "@thewaver/ss-utils";

import { MENU_CONFIGS, PREVIEW_EXCLUDED_PAGES } from "./App.const";
import type { ComponentConfig, MenuBranchConfig, MenuNodeConfig } from "./App.types";
import DocsRedirect from "./DocsRedirect.svelte";
import type { PageViewKey } from "./PageComponents/ViewTabs/ViewTabs.types";
import type { GalleryItem, GallerySection } from "./Pages/GalleryPage/GalleryPage.types";

export const getIsBranchConfig = (node: MenuNodeConfig): node is MenuBranchConfig => "children" in node;

const GALLERY_NAME_SEPARATOR = " / ";

export const GETTING_STARTED_ROUTE = "/getting-started";
export const GALLERY_ROUTE = "/gallery";

export const componentToRouteName = (name: string) => `/${StringUtils.camelToKebabCase(name)}`;

export const flattenConfigs = (nodes: MenuNodeConfig[]): ComponentConfig[] =>
    nodes.flatMap((node) => (getIsBranchConfig(node) ? flattenConfigs(node.children) : [node]));

export const toPageHref = (config: ComponentConfig, view: PageViewKey) =>
    toPageViewRoute(componentToRouteName(config.name), config.component === undefined ? "docs" : view);

export const COMPONENT_CONFIGS = flattenConfigs(MENU_CONFIGS);

export const getHasPreview = (config: ComponentConfig): config is Required<ComponentConfig> =>
    config.component !== undefined && !PREVIEW_EXCLUDED_PAGES.includes(config.name);

const toGalleryItems = (nodes: MenuNodeConfig[], trail: string[]): GalleryItem[] =>
    nodes.flatMap((node) => {
        if (getIsBranchConfig(node)) return toGalleryItems(node.children, [...trail, node.name]);

        return getHasPreview(node)
            ? [
                  {
                      name: [...trail, node.name].join(GALLERY_NAME_SEPARATOR),
                      href: componentToRouteName(node.name),
                      component: node.component,
                  },
              ]
            : [];
    });

export const GALLERY_SECTIONS: GallerySection[] = MENU_CONFIGS.filter((category) => !category.hidden)
    .map((category) => ({
        name: category.name,
        description: category.description,
        items: toGalleryItems(category.children, []),
    }))
    .filter((section) => section.items.length > 0);

export const COMPONENT_CONFIGS_BY_ROUTE: Record<string, ComponentConfig | undefined> = Object.fromEntries(
    COMPONENT_CONFIGS.map((config) => [componentToRouteName(config.name), config]),
);

const ROUTES: Routes = {
    "/": () => import("./Pages/AboutPage/AboutPage.svelte"),
    [GETTING_STARTED_ROUTE]: () => import("./Pages/GettingStartedPage/GettingStartedPage.svelte"),
    [GALLERY_ROUTE]: () => import("./Pages/GalleryPage/GalleryPage.svelte"),
    ...Object.fromEntries(
        COMPONENT_CONFIGS.map((config) => [
            componentToRouteName(config.name),
            { "/": config.component ?? DocsRedirect, "/docs": () => import("./DocsRoute.svelte") },
        ]),
    ),
};

export const { navigate, route } = createRouter(ROUTES, { base: toRouterBase(import.meta.env.BASE_URL) });
