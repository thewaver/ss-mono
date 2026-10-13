import type { CSSPadding, Point2d, Size2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
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

export type BaseSelectValues = {
    /** Identifies the select, and is what the field and list compose their own ids from. */
    id?: string;
    /** Names the select for assistive technology. */
    ariaLabel?: string;
    /**
     * Names the popup list for assistive technology, written as its `aria-label`. Left out, the list is named after
     * the `Label` the select sits in, or after the field when there is none. The `Label` fallback reads everything
     * inside the label, the field's current text included, so pass this where the list's name should be exactly the
     * caption.
     */
    listAriaLabel?: string;
    /** Whether a value has to be given. It is announced and not enforced, because the library validates nothing. */
    isRequired?: boolean;
    /** Where the list sits against the field. */
    placement?: AnchorPlacement;
    /** How far the list is held clear of the field. */
    offset?: Point2d;
    /** Screen room to stay out of, for a consumer with a fixed header or sidebar the list must not slide under. */
    reservedScreenSize?: Size2d;
    /** How long the list takes to fade in and out. */
    transitionDurationMs?: number;
    /** How much room is left inside the field, around its text. */
    padding?: CSSPadding | number;
    /** Whether there are more options to come, so the list can say so rather than looking finished. */
    hasMoreOptions?: boolean;
    /** How long either marker takes to slide from one option to the next, and to fade. */
    floaterTransitionDurationMs?: number;
    /** Names the clear control for assistive technology, where what it draws has no text of its own. */
    clearAriaLabel?: string;
};

export type BaseSelectCbs = {
    /** Runs when the reader reaches the end of the list, for a consumer fetching more options as they scroll. */
    onReachEnd?: () => void;
    /**
     * Guesses how tall an option will be before it is drawn, which is what lets a long list render only what is on
     * screen.
     */
    computeEstimatedOptionHeight?: (index: number) => number;
    /** Guesses how tall a group heading will be before it is drawn, for the same reason. */
    computeEstimatedGroupHeight?: (index: number) => number;
};

export type BaseSelectProps = BaseSelectValues & BaseSelectCbs;
