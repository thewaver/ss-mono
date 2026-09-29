import type { VNodeChild } from "vue";

import type { AnchorPlacement, InteractionFlags, MenuFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-vue";
import type { Action, Destination } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuActions.types";

export type { Action, Destination } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuActions.types";

export type MenuExampleProps = {
    onActivate: (action: Action) => void;
};

export type MenuDrivenExampleProps = MenuExampleProps & {
    "visibility": boolean;
    "onUpdate:visibility"?: (isOpen: boolean) => void;
};

export type MenuCascaderExampleProps = {
    "path": string[];
    "onUpdate:path"?: (path: string[]) => void;
};

export type MenuPopupProps = {
    renderItems: () => VNodeChild;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    placement: AnchorPlacement;
    flags: InteractionFlags<MenuFlags>;
};

export type MenuActionItemProps = {
    item: MenuItem<Action>;
    flags: InteractionFlags<MenuItemFlags>;
};

export type MenuDestinationItemProps = {
    item: MenuItem<Destination>;
    flags: InteractionFlags<MenuItemFlags>;
};
