import type { AccessorProps, SidebarEdge } from "@thewaver/ss-components";

export type SidebarToggleProps = AccessorProps<{
    sidebarId: string;
    edge: SidebarEdge;
    isExpanded: boolean;
    ariaLabel: string;
}> & {
    onToggle: () => void;
};
