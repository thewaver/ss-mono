import type { LazyRouteComponent } from "sv-router";
import type { Component } from "svelte";

export type ComponentConfig = {
    name: string;
    component?: LazyRouteComponent;
    docs?: () => Promise<{ default: Component }>;
};

export type MenuBranchConfig = {
    name: string;
    children: MenuNodeConfig[];
    hidden?: boolean;
};

export type MenuNodeConfig = ComponentConfig | MenuBranchConfig;

export type RoutePath = `/${string}`;
