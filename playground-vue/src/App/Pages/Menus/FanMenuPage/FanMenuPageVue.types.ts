import type { VNodeChild } from "vue";

import type { InteractionFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-vue";
import type { FanAction } from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.types";

export type { FanAction } from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.types";

export type FanMenuItemProps = {
    item: MenuItem<FanAction>;
    flags: InteractionFlags<MenuItemFlags>;
};

export type FanMenuFloaterProps = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};

export type FanMenuPopupProps = {
    renderItems: () => VNodeChild;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};
