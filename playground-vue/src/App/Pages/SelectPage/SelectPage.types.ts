import type { VNodeChild } from "vue";

import type {
    AnchorPlacement,
    InteractionFlags,
    SelectFlags,
    SelectItem,
    SelectOption,
} from "@thewaver/ss-components-vue";
import type { Airport, Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

export type { Airport, Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

export type SelectExampleProps = {
    "value": string | undefined;
    "onUpdate:value"?: (value: string | undefined) => void;
    "options"?: SelectItem<string>[];
};

export type SelectClearableExampleProps = {
    "value": string | undefined;
    "onUpdate:value"?: (value: string | undefined) => void;
    "onSelectionChange": (value: string | undefined) => void;
};

export type SelectAirportExampleProps = {
    "value": Airport | undefined;
    "onUpdate:value"?: (value: Airport | undefined) => void;
};

export type SelectDeliveryExampleProps = {
    "value": Delivery | undefined;
    "onUpdate:value"?: (value: Delivery | undefined) => void;
};

export type SelectRoutesExampleProps = SelectDeliveryExampleProps & {
    options: SelectOption<Delivery>[];
    hasMore: boolean;
    isFetching: boolean;
    onReachEnd: () => void;
};

export type SelectPopupProps = {
    renderOptions: () => VNodeChild;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    placement: AnchorPlacement;
    flags: InteractionFlags<SelectFlags>;
};
