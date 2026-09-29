import type { Signal } from "solid-js";

import type { AccessorProps, SidebarEdge, SidebarLayout } from "@thewaver/ss-components-solid";

export type SidebarExampleProps = AccessorProps<{
    edge: SidebarEdge;
    layout: SidebarLayout;
    isExpandedOnHover: boolean;
    expanded: Signal<boolean>;
}>;
