import type { VNodeChild } from "vue";

import type { AnchorPlacement, InteractionFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-vue";
import type {
    BaseToolbarBasicDocsExampleCbs,
    BaseToolbarBasicDocsExampleValues,
    BaseToolbarTooltipDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.types";

export type ToolbarBasicDocsExampleProps = BaseToolbarBasicDocsExampleValues & BaseToolbarBasicDocsExampleCbs;

export type ToolbarTooltipDocsExampleProps = BaseToolbarTooltipDocsExampleValues;

export type ResizableBarProps = {
    width?: number;
    onResize?: (width: number) => void;
};

export type ToolbarPopupProps = {
    renderItems: () => VNodeChild;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    placement: AnchorPlacement;
};

export type ToolbarOverflowItemProps = {
    item: MenuItem<string>;
    flags: InteractionFlags<MenuItemFlags>;
};
