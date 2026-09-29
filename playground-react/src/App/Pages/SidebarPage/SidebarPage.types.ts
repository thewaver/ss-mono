import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components-react";

export type SidebarExampleProps = {
    edge: SidebarEdge;
    layout: SidebarLayout;
    isExpandedOnHover: boolean;
    expanded: readonly [boolean, (isExpanded: boolean) => void];
};
