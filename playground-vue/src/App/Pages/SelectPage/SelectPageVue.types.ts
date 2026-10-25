import type { VNodeChild } from "vue";

import type { AnchorPlacement, InteractionFlags, SelectFlags } from "@thewaver/ss-components-vue";
import type {
    BaseSelectBasicDocsExampleValues,
    BaseSelectDisabledOptionsDocsExampleValues,
    BaseSelectGroupsDocsExampleValues,
    BaseSelectTooltipDocsExampleValues,
    BaseSelectVirtualizedDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.types";

export type SelectBasicDocsExampleProps = BaseSelectBasicDocsExampleValues;

export type SelectGroupsDocsExampleProps = BaseSelectGroupsDocsExampleValues;

export type SelectDisabledOptionsDocsExampleProps = BaseSelectDisabledOptionsDocsExampleValues;

export type SelectVirtualizedDocsExampleProps = BaseSelectVirtualizedDocsExampleValues & {
    "visibility": boolean;
    "onUpdate:visibility"?: (isOpen: boolean) => void;
};

export type SelectTooltipDocsExampleProps = BaseSelectTooltipDocsExampleValues;

export type SelectPopupProps = {
    renderOptions: () => VNodeChild;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    placement: AnchorPlacement;
    flags: InteractionFlags<SelectFlags>;
};
