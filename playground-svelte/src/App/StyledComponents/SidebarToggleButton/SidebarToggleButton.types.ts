import type { HTMLButtonAttributes } from "svelte/elements";

import type { InteractionFlags, SidebarEdge } from "@thewaver/ss-components-svelte";

export type SidebarToggleButtonProps = {
    flags: InteractionFlags;
    edge: SidebarEdge;
    isExpanded: boolean;
    ref?: HTMLButtonElement;
} & Omit<HTMLButtonAttributes, "class" | "type" | "children">;
