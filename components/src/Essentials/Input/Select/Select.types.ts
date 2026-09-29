import type { CheckedState } from "../../../Abstracts/CheckedState/CheckedState.types";
import type { FlatRow } from "../../../Abstracts/Flattener/Flattener.types";

export type SelectFlags = {
    isOpen: boolean;
    isEmpty: boolean;
    isFiltering: boolean;
};

export type SelectOptionFlags = {
    isHighlighted: boolean;
    isSelected: boolean;
};

export type SelectGroupFlags = {
    checkedState: CheckedState;
};

export type SelectOptionRecord<T, TTooltipDefs = unknown> = {
    value: T;
    isDisabled?: boolean;
    isReachableWhenDisabled?: boolean;
    tooltipDefs?: TTooltipDefs;
};

export type SelectOptionGroupRecord<T, TTooltipDefs = unknown> = {
    label: string;
    options: SelectOptionRecord<T, TTooltipDefs>[];
};

export type SelectItemRecord<T, TTooltipDefs = unknown> =
    SelectOptionRecord<T, TTooltipDefs> | SelectOptionGroupRecord<T, TTooltipDefs>;

export type SelectRowRecord<T, TTooltipDefs = unknown> = FlatRow<SelectItemRecord<T, TTooltipDefs>>;
