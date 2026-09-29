import type { InteractionFlags, SidebarEdge } from "@thewaver/ss-components-vue";

export type SidebarToggleButtonProps = {
    flags: InteractionFlags;
    edge: SidebarEdge;
    isExpanded: boolean;
};
