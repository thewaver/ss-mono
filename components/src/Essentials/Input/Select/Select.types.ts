import type { Accessor, JSX } from "solid-js";

import { type CSSPadding, Point2d, Size2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { CheckedState } from "../../../Abstracts/CheckedState/CheckedState.types";
import type { FlatRow } from "../../../Abstracts/Flattener/Flattener.types";
import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type {
    InteractionControlProps,
    InteractionTooltipDefs,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { TextFieldTextStyle } from "../../../Primitives/TextField/TextField.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../../Utils/typeUtils";

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

export type SelectOption<T> = {
    value: T;
    isDisabled?: boolean;
    isReachableWhenDisabled?: boolean;
    tooltipDefs?: InteractionTooltipDefs<SelectOptionFlags>;
};

export type SelectOptionGroup<T> = {
    label: string;
    options: SelectOption<T>[];
};

export type SelectItem<T> = SelectOption<T> | SelectOptionGroup<T>;

export type SelectRow<T> = FlatRow<SelectItem<T>>;

export type SelectFieldProps = AccessorProps<
    InteractionControlProps<SelectFlags> & {
        /** Identifies the list the field opens, so the field can point at it. */
        listboxId: string;
        /**
         * Identifies the option the keyboard is currently on, which is how the reader is told what is highlighted
         * without focus leaving the field.
         */
        activeOptionId: string | undefined;
        ariaLabel?: string;
        /** Whether typing in the field narrows the list rather than jumping to a match. */
        isFilterable: boolean;
        /** What the reader has typed to narrow the list by. */
        query: string;
        /** How far the field's text is inset, so it clears whatever the consumer has drawn inside the field. */
        textInset: JSX.CSSProperties;
        /** Styles the field's text against its current state. */
        computeTextStyle?: (getFlags: () => InteractionFlags<SelectFlags>) => TextFieldTextStyle;
        /** Runs when the field is activated and the list should open or close. */
        onToggle: () => void;
        /** Runs on a key pressed while the field has focus, which is what walks and picks from the list. */
        onKeyDown: (e: KeyboardEvent) => void;
        /** Runs as the reader types into a filterable field. */
        onQueryInput: (query: string) => void;
    }
>;

export type SelectOptionItemProps = AccessorProps<
    InteractionControlProps<SelectOptionFlags> & {
        /**
         * Whether this option scrolls itself into view when it becomes the highlighted one, which a list that windows
         * its options does for itself.
         */
        isSelfScrolling: boolean;
        /** Runs when this option is picked. */
        onSelect: () => void;
    }
>;

export type SelectCompositeProps<T> = Omit<InteractionWrapperProps<SelectFlags>, "renderControl" | "extraFlags"> &
    AccessorProps<{
        /** Identifies the select, and is what the field and list compose their own ids from. */
        id?: string;
        /** Names the select for assistive technology. */
        ariaLabel?: string;
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
        /** Whether more than one option can be picked at a time. */
        isMultiple?: boolean;
        /** Whether there are more options to come, so the list can say so rather than looking finished. */
        hasMoreOptions?: boolean;
        /** Styles the field's text against its current state. */
        computeTextStyle?: (getFlags: () => InteractionFlags<SelectFlags>) => TextFieldTextStyle;
        /** Whether the list is open. It is the only thing that opens or closes it. */
        visibilitySignal?: SignalSource<boolean>;
        /** What the reader has typed to narrow the list by. It is the only thing that changes the query. */
        querySignal?: SignalSource<string>;
        /**
         * Guesses how tall an option will be before it is drawn, which is what lets a long list render only what is on
         * screen.
         */
        computeEstimatedOptionHeight?: (index: number) => number;
        /** Guesses how tall a group heading will be before it is drawn, for the same reason. */
        computeEstimatedGroupHeight?: (index: number) => number;
        /**
         * Draws the surface the options sit on. The options are handed in rather than built, so the consumer decides
         * what surrounds them.
         */
        renderPopup: (
            renderOptions: () => JSX.Element,
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
            getPlacement: () => AnchorPlacement,
            getFlags: () => InteractionFlags<SelectFlags>,
        ) => JSX.Element;
        /** Runs when the reader reaches the end of the list, for a consumer fetching more options as they scroll. */
        onReachEnd?: () => void;
    }> & {
        /** The options, in the order they are shown. An entry carrying children becomes a group. */
        options: MaybeAccessor<SelectItem<T>[]>;
        /** Which options are currently picked. */
        selectedOptions: MaybeAccessor<SelectOption<T>[]>;
        /** Whether a given value counts as picked, for a consumer whose values are not compared by identity. */
        computeIsSelected: (value: T) => boolean;
        /** The text an option is found by when the reader types, where that is not its visible text. */
        computeCustomText?: (option: SelectOption<T>) => string;
        /** Draws the field, and is handed everything that is picked. */
        renderContent: (
            getSelectedOptions: Accessor<SelectOption<T>[]>,
            getFlags: () => InteractionFlags<SelectFlags>,
        ) => JSX.Element;
        /** Draws one option. */
        renderOption: (
            getOption: Accessor<SelectOption<T>>,
            getFlags: () => InteractionFlags<SelectOptionFlags>,
        ) => JSX.Element;
        /** Draws one group heading. */
        renderGroup?: (getGroup: Accessor<SelectOptionGroup<T>>, getFlags: () => SelectGroupFlags) => JSX.Element;
        /** Runs when an option is picked. */
        onPick: (value: T) => void;
    };

export type SelectPresetProps<T> = Omit<
    SelectCompositeProps<T>,
    "selectedOptions" | "isMultiple" | "computeIsSelected" | "renderContent" | "onPick"
>;

export type SelectProps<T> = SelectPresetProps<T> & {
    /** Which option is picked. It is the only thing that picks one. */
    valueSignal: SignalSource<T | undefined>;
    /** Draws the field, and is handed the one option that is picked. */
    renderContent: (
        getSelectedOption: Accessor<SelectOption<T> | undefined>,
        getFlags: () => InteractionFlags<SelectFlags>,
    ) => JSX.Element;
    /** Runs when a different option is picked. */
    onSelectionChange?: (value: T) => void;
};
