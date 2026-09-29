import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components-svelte";

export type SidebarExampleProps = {
    edge: SidebarEdge;
    layout: SidebarLayout;
    isExpandedOnHover: boolean;
    expanded: boolean;
};
