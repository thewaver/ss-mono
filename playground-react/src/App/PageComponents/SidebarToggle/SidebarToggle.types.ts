import type { SidebarEdge } from "@thewaver/ss-components-react";

export type SidebarToggleProps = {
    sidebarId: string;
    edge: SidebarEdge;
    isExpanded: boolean;
    ariaLabel: string;
    onToggle: () => void;
};
