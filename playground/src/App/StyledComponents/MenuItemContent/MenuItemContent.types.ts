import type { InteractionFlags, MenuItemFlags, MenuItemKind } from "@thewaver/ss-components";

export type BaseMenuItemContentValues = {
    flags: InteractionFlags<MenuItemFlags>;
    kind: MenuItemKind | undefined;
    shortcut?: string;
    hasHoverFloater?: boolean;
    hasSelectionFloater?: boolean;
};

export type BaseMenuItemContentProps = BaseMenuItemContentValues;
