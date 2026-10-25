import type { VNodeChild } from "vue";

import type {
    AnchorPlacement,
    InteractionFlags,
    MenuFlags,
    MenuItem,
    MenuItemFlags,
} from "@thewaver/ss-components-vue";
import type { Action, Destination } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuActions.types";
import type {
    BaseMenuBasicDocsExampleValues,
    BaseMenuDisabledItemsDocsExampleValues,
    BaseMenuGlideDocsExampleValues,
    BaseMenuPlacementDocsExampleValues,
    BaseMenuTooltipDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.types";

export type { Action, Destination } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuActions.types";

export type MenuBasicDocsExampleProps = BaseMenuBasicDocsExampleValues;

export type MenuGlideDocsExampleProps = BaseMenuGlideDocsExampleValues;

export type MenuDisabledItemsDocsExampleProps = BaseMenuDisabledItemsDocsExampleValues;

export type MenuPlacementDocsExampleProps = BaseMenuPlacementDocsExampleValues;

export type MenuTooltipDocsExampleProps = BaseMenuTooltipDocsExampleValues;

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
