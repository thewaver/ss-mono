import type { ButtonHTMLAttributes, Ref } from "react";

import type { InteractionFlags, SidebarEdge } from "@thewaver/ss-components-react";

export type SidebarToggleButtonProps = {
    flags: InteractionFlags;
    edge: SidebarEdge;
    isExpanded: boolean;
    ref?: Ref<HTMLButtonElement>;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "type" | "children">;
