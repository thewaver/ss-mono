import type { AccessorProps, SidebarEdge } from "@thewaver/ss-components-solid";

export type SidebarToggleProps = AccessorProps<{
    sidebarId: string;
    edge: SidebarEdge;
    isExpanded: boolean;
    ariaLabel: string;
}> & {
    onToggle: () => void;
};
