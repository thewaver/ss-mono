import type { InteractionFlags, MenuFlags, MenuItemFlags } from "@thewaver/ss-components-vue";

export type FrameworkMenuItemProps = {
    flags: InteractionFlags<MenuItemFlags>;
};

export type FrameworkMenuTriggerProps = {
    flags: InteractionFlags<MenuFlags>;
};
