import type { VNodeChild } from "vue";

import type {
    AnchorPlacement,
    InteractionFlags,
    MenuFlags,
    MenuItem,
    MenuItemFlags,
} from "@thewaver/ss-components-vue";
import type { MenubarEntry } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarEntry.types";
import type { BaseMenubarOverflowDocsExampleValues } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarPage.types";

export type { MenubarEntry } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarEntry.types";

export type MenubarOverflowDocsExampleProps = BaseMenubarOverflowDocsExampleValues;

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
