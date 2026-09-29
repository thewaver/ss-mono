import type { InteractionFlags, MenuItemFlags, MenuItemKind } from "@thewaver/ss-components-vue";

export type MenuItemContentProps = {
    flags: InteractionFlags<MenuItemFlags>;
    kind: MenuItemKind | undefined;
    shortcut?: string;
};
