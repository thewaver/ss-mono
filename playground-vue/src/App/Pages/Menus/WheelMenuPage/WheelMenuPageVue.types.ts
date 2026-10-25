import type { VNodeChild } from "vue";

import type { InteractionFlags, MenuItem, MenuItemFlags, PlacementRect } from "@thewaver/ss-components-vue";
import type {
    BaseWheelMenuBandsDocsExampleValues,
    BaseWheelMenuBasicDocsExampleValues,
    BaseWheelMenuFlickDocsExampleValues,
    WheelAction,
} from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.types";

export type { WheelAction } from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.types";

export type WheelMenuBasicDocsExampleProps = BaseWheelMenuBasicDocsExampleValues;

export type WheelMenuBandsDocsExampleProps = BaseWheelMenuBandsDocsExampleValues;

export type WheelMenuFlickDocsExampleProps = BaseWheelMenuFlickDocsExampleValues;

export type WheelGradientDefsProps = {
    gradientId: string;
};

export type WheelMenuItemProps = {
    gradientId: string;
    item: MenuItem<WheelAction>;
    flags: InteractionFlags<MenuItemFlags>;
    placement: PlacementRect | undefined;
};

export type WheelMenuPopupProps = {
    renderItems: () => VNodeChild;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};
