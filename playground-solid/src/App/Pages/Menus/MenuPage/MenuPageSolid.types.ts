import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseMenuBasicDocsExampleValues,
    BaseMenuDisabledItemsDocsExampleValues,
    BaseMenuGlideDocsExampleValues,
    BaseMenuPlacementDocsExampleValues,
    BaseMenuTooltipDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.types";

export type { Action, Destination } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuActions.types";

export type MenuBasicDocsExampleProps = AccessorValues<BaseMenuBasicDocsExampleValues>;

export type MenuGlideDocsExampleProps = AccessorValues<BaseMenuGlideDocsExampleValues>;

export type MenuDisabledItemsDocsExampleProps = AccessorValues<BaseMenuDisabledItemsDocsExampleValues>;

export type MenuPlacementDocsExampleProps = AccessorValues<BaseMenuPlacementDocsExampleValues>;

export type MenuTooltipDocsExampleProps = AccessorValues<BaseMenuTooltipDocsExampleValues>;
