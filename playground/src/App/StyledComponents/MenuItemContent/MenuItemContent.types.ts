import type { AccessorProps, InteractionFlags, MenuItemFlags } from "@thewaver/ss-components";

export type MenuItemContentProps = AccessorProps<{
    flags: InteractionFlags<MenuItemFlags>;
    shortcut?: string;
}>;
