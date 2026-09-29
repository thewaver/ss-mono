import type { Component } from "vue";

export type ComponentConfig = {
    name: string;
    description: string;
    component?: Component;
};

export type MenuBranchConfig = {
    name: string;
    children: MenuNodeConfig[];
    hidden?: boolean;
};

export type MenuNodeConfig = ComponentConfig | MenuBranchConfig;
