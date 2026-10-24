import type { JSX } from "solid-js";

export type ComponentConfig = {
    name: string;
    component?: () => JSX.Element;
    docs?: () => JSX.Element;
};

export type MenuBranchConfig = {
    name: string;
    children: MenuNodeConfig[];
    hidden?: boolean;
};

export type MenuNodeConfig = ComponentConfig | MenuBranchConfig;
