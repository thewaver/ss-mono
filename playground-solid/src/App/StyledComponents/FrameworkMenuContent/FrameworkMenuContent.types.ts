import type { AccessorProps, InteractionFlags, MenuFlags, MenuItemFlags } from "@thewaver/ss-components-solid";

export type FrameworkMenuItemProps = AccessorProps<{
    flags: InteractionFlags<MenuItemFlags>;
}>;

export type FrameworkMenuTriggerProps = AccessorProps<{
    flags: InteractionFlags<MenuFlags>;
}>;
