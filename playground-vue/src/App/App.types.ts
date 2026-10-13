import type { Component } from "vue";

export type ComponentConfig = {
    name: string;
    component?: () => Promise<{ default: Component }>;
};

export type MenuBranchConfig = {
    name: string;
    children: MenuNodeConfig[];
    hidden?: boolean;
};

export type MenuNodeConfig = ComponentConfig | MenuBranchConfig;
