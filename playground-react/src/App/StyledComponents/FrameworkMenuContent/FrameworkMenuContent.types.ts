import type { InteractionFlags, MenuFlags, MenuItemFlags } from "@thewaver/ss-components-react";

export type FrameworkMenuItemProps = {
    flags: InteractionFlags<MenuItemFlags>;
};

export type FrameworkMenuTriggerProps = {
    flags: InteractionFlags<MenuFlags>;
};
