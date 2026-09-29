import type { Routes } from "sv-router";
import { createRouter } from "sv-router";

import { toRouterBase } from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/FrameworkSwitch.const";
import { toPageViewRoute } from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";
import { StringUtils } from "@thewaver/ss-utils";

import { MENU_CONFIGS } from "./App.const";
import type { ComponentConfig, MenuBranchConfig, MenuNodeConfig } from "./App.types";
import DocsRedirect from "./DocsRedirect.svelte";
import EmptyPage from "./EmptyPage.svelte";
import type { PageViewKey } from "./PageComponents/ViewTabs/ViewTabs.types";

export const getIsBranchConfig = (node: MenuNodeConfig): node is MenuBranchConfig => "children" in node;

export const componentToRouteName = (name: string) => `/${StringUtils.camelToKebabCase(name)}`;

export const flattenConfigs = (nodes: MenuNodeConfig[]): ComponentConfig[] =>
    nodes.flatMap((node) => (getIsBranchConfig(node) ? flattenConfigs(node.children) : [node]));

export const toPageHref = (config: ComponentConfig, view: PageViewKey) =>
    toPageViewRoute(componentToRouteName(config.name), config.component === undefined ? "docs" : view);

export const COMPONENT_CONFIGS = flattenConfigs(MENU_CONFIGS);

export const COMPONENT_CONFIGS_BY_ROUTE: Record<string, ComponentConfig | undefined> = Object.fromEntries(
    COMPONENT_CONFIGS.map((config) => [componentToRouteName(config.name), config]),
);

const ROUTES: Routes = {
    "/": EmptyPage,
    ...Object.fromEntries(
        COMPONENT_CONFIGS.map((config) => [
            componentToRouteName(config.name),
            { "/": config.component ?? DocsRedirect, "/docs": () => import("./DocsRoute.svelte") },
        ]),
    ),
};

export const { navigate, route } = createRouter(ROUTES, { base: toRouterBase(import.meta.env.BASE_URL) });
