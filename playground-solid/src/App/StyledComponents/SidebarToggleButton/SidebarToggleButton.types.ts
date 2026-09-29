import type { JSX } from "solid-js";

import type { AccessorProps, InteractionFlags, SidebarEdge } from "@thewaver/ss-components-solid";

export type SidebarToggleButtonProps = AccessorProps<{
    flags: InteractionFlags;
    edge: SidebarEdge;
    isExpanded: boolean;
}> &
    Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "class" | "classList" | "type" | "children">;
