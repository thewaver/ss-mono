import type { InteractionFlags, MenuItemFlags, MenuItemKind } from "@thewaver/ss-components-react";

export type MenuItemContentProps = {
    flags: InteractionFlags<MenuItemFlags>;
    kind: MenuItemKind | undefined;
    shortcut?: string;
    isGliding?: boolean;
};
