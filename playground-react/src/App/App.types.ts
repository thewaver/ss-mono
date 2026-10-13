import type { ReactNode } from "react";

export type ComponentConfig = {
    name: string;
    component?: () => ReactNode;
};

export type MenuBranchConfig = {
    name: string;
    children: MenuNodeConfig[];
    hidden?: boolean;
};

export type MenuNodeConfig = ComponentConfig | MenuBranchConfig;
