import type { Component } from "vue";

export type ComponentConfig = {
    name: string;
    description: string;
    component?: () => Promise<{ default: Component }>;
};

export type MenuBranchConfig = {
    name: string;
    description?: string;
    children: MenuNodeConfig[];
    hidden?: boolean;
};

export type MenuNodeConfig = ComponentConfig | MenuBranchConfig;
