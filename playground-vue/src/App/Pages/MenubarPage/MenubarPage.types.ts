import type { VNodeChild } from "vue";

import type { AnchorPlacement, InteractionFlags, MenuFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-vue";
import type { MenubarEntry } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarEntry.types";

export type { MenubarEntry } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarEntry.types";

export type MenubarExampleProps = {
    "checked": MenubarEntry[];
    "onUpdate:checked"?: (checked: MenubarEntry[]) => void;
    "onActivate": (entry: MenubarEntry) => void;
};

export type MenubarFrameProps = {
    width: number;
};

export type MenubarPopupProps = {
    renderItems: () => VNodeChild;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    placement: AnchorPlacement;
    flags: InteractionFlags<MenuFlags>;
};

export type MenubarItemProps = {
    item: MenuItem<MenubarEntry>;
    flags: InteractionFlags<MenuItemFlags>;
};
