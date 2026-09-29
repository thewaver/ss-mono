import type { SidebarEdge } from "@thewaver/ss-components-svelte";

export type SidebarToggleProps = {
    sidebarId: string;
    edge: SidebarEdge;
    isExpanded: boolean;
    ariaLabel: string;
    onToggle: () => void;
};
