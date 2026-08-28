import type { AccessorProps, InteractionFlags, MenuItemFlags, MenuItemKind } from "@thewaver/ss-components";

export type MenuItemContentProps = AccessorProps<{
    flags: InteractionFlags<MenuItemFlags>;
    kind: MenuItemKind | undefined;
    shortcut?: string;
}>;
