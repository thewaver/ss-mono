import type { Signal } from "solid-js";

import type { AccessorProps, SidebarEdge, SidebarLayout } from "@thewaver/ss-components";

export type SidebarExampleProps = AccessorProps<{
    edge: SidebarEdge;
    layout: SidebarLayout;
    isExpandedOnHover: boolean;
    expandedSignal: Signal<boolean>;
}>;
