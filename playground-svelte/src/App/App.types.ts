import type { LazyRouteComponent } from "sv-router";

export type ComponentConfig = {
    name: string;
    description: string;
    component?: LazyRouteComponent;
};

export type MenuBranchConfig = {
    name: string;
    description?: string;
    children: MenuNodeConfig[];
    hidden?: boolean;
};

export type MenuNodeConfig = ComponentConfig | MenuBranchConfig;

export type RoutePath = `/${string}`;
