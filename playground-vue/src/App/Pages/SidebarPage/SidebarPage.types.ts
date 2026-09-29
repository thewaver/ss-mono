import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components-vue";

export type SidebarExampleProps = {
    "edge": SidebarEdge;
    "layout": SidebarLayout;
    "isExpandedOnHover": boolean;
    "expanded": boolean;
    "onUpdate:expanded"?: (isExpanded: boolean) => void;
};
