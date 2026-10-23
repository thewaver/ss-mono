import type { Accessor, JSX } from "solid-js";

import type {
    BaseListboxCbs,
    BaseListboxValues,
    InteractionFlags,
    ListboxFocusModel,
    ListboxOrientation,
    SelectGroupBoxExcludesWindowing,
    SelectGroupFlags,
    SelectOptionFlags,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, MaybeAccessor, SignalSource } from "../../../Utils/typeUtils";
import type { SelectItem, SelectOption, SelectOptionGroup, SelectRow } from "../Select/SelectSolid.types";

export type ListboxCursor<T> = {
    focusModel: ListboxFocusModel;
    getListboxId: () => string;
    getOrientation: Accessor<ListboxOrientation>;
    getOptions: Accessor<SelectItem<T>[]>;
    getItemRows: Accessor<SelectRow<T>[]>;
    getRows: Accessor<SelectRow<T>[]>;
    getFlatOptions: Accessor<SelectOption<T>[]>;
    getHighlightedIndex: Accessor<number | undefined>;
    getIsHighlightShown: Accessor<boolean>;
    getHighlightRequests: Accessor<number>;
    getActiveOptionId: Accessor<string | undefined>;
    getOptionId: (index: number) => string;
    setHasFocus: (hasFocus: boolean) => void;
    highlight: (value: T | undefined) => boolean;
    pick: (value: T) => boolean;
    handleKeyDown: (e: KeyboardEvent) => void;
};

export type ListboxOptionItemProps = AccessorProps<
    InteractionControlProps<SelectOptionFlags> & {
        /**
         * Whether this option scrolls itself into view when it becomes the highlighted one, which a list that windows
         * its options does for itself.
         */
        isSelfScrolling: boolean;
        /**
         * Where focus sits while the list is used, which decides how far revealing this option may scroll: only
         * within the popup the list is drawn in when focus stays in a field, and through every scroller, the page
         * included, when the option itself holds focus.
         */
        focusModel: ListboxFocusModel;
        /** Runs when this option takes focus, which is how a list whose options hold focus learns where the reader is. */
        onFocus?: () => void;
        /** Runs when this option is picked. */
        onSelect: () => void;
    }
>;

export type ListboxOptionsProps<T> = AccessorValues<
    Pick<BaseListboxValues, "isDisabled" | "hasMoreOptions" | "floaterTransitionDurationMs">
> &
    AccessorProps<{
        /**
         * Whether the list is on screen and taking part. A list inside a popup is live only while the popup is open, so a
         * closing fade neither windows, nor loads more, nor scrolls.
         */
        isLive: boolean;
        /** Runs when the reader reaches the end of the list, for a consumer fetching more options as they scroll. */
        onReachEnd?: () => void;
        /**
         * Guesses how tall an option will be before it is drawn, which is what lets a long list render only what is on
         * screen. Only a vertical list is windowed; a horizontal one mounts every option whatever is passed here.
         */
        computeEstimatedOptionHeight?: (index: number) => number;
        /** Guesses how tall a group heading will be before it is drawn, for the same reason. */
        computeEstimatedGroupHeight?: (index: number) => number;
        /**
         * Draws the marker that slides to the selected option, behind it. The fade is handed in rather than applied: the
         * marker fades out when nothing is selected, and in a list that only draws what is on screen it fades out while
         * the selected option is scrolled away and back in when it returns. Where several options are selected, it follows
         * the first of them.
         */
        renderSelectionFloater?: (
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
        /**
         * Draws the marker that slides to the highlighted option — the one the pointer or the arrow keys are on — behind
         * it, drawn under the selection's marker where both are given. It fades out while nothing is highlighted, and in
         * a list that only draws what is on screen, while the highlighted option is scrolled away.
         */
        renderHighlightFloater?: (
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
    }> & {
        /** The list's state, from {@link ListboxUtils.createCursor}: what is highlighted, and how the keyboard walks it. */
        cursor: ListboxCursor<T>;
        /** Whether a given value counts as picked, for a consumer whose values are not compared by identity. */
        computeIsSelected: (value: T) => boolean;
        /** Draws one option. */
        renderOption: (
            getOption: Accessor<SelectOption<T>>,
            getFlags: () => InteractionFlags<SelectOptionFlags>,
        ) => JSX.Element;
        /** Draws one group heading. */
        renderGroupHeader?: (getGroup: Accessor<SelectOptionGroup<T>>, getFlags: () => SelectGroupFlags) => JSX.Element;
        /**
         * Draws the box a group sits in, around its heading and its options, which are handed in to be placed inside it.
         * Refused alongside `computeEstimatedOptionHeight`, since a list that only draws what is on screen places each row
         * on its own and a group has no box there.
         */
        renderGroupBox?: (
            renderContent: () => JSX.Element,
            getGroup: Accessor<SelectOptionGroup<T>>,
            getFlags: () => SelectGroupFlags,
        ) => JSX.Element;
    };

export type ListboxCompositeProps<T> = AccessorValues<BaseListboxValues> &
    BaseListboxCbs &
    AccessorProps<{
        /** Whether more than one option can be picked at a time. */
        isMultiple?: boolean;
        /**
         * Draws the marker that slides to the selected option, behind it. The fade is handed in rather than applied: the
         * marker fades out when nothing is selected, and in a list that only draws what is on screen it fades out while
         * the selected option is scrolled away and back in when it returns. Where several options are selected, it follows
         * the first of them.
         */
        renderSelectionFloater?: (
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
        /**
         * Draws the marker that slides to the highlighted option — the one the pointer or the arrow keys are on — behind
         * it, drawn under the selection's marker where both are given. It fades out while nothing is highlighted, and in
         * a list that only draws what is on screen, while the highlighted option is scrolled away.
         */
        renderHighlightFloater?: (
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
    }> & {
        /** The options, in the order they are shown. An entry carrying children becomes a group. */
        options: MaybeAccessor<SelectItem<T>[]>;
        /** Which options are currently picked. */
        selectedOptions: MaybeAccessor<SelectOption<T>[]>;
        /** Whether a given value counts as picked, for a consumer whose values are not compared by identity. */
        computeIsSelected: (value: T) => boolean;
        /**
         * The text an option is found by when the reader types, where that is not its visible text. An option out of view
         * in a windowed list has no text to read, so without this it is found by its value written out as text — enough
         * for a list of plain strings, and the reason to give it for anything else.
         */
        computeCustomText?: (option: SelectOption<T>) => string;
        /**
         * Draws one option. The option holds focus while the reader is on it, so `isFocused` and `isFocusVisible` are live
         * here, and `isHighlighted` is true only while focus is inside the list.
         */
        renderOption: (
            getOption: Accessor<SelectOption<T>>,
            getFlags: () => InteractionFlags<SelectOptionFlags>,
        ) => JSX.Element;
        /** Draws one group heading. */
        renderGroupHeader?: (getGroup: Accessor<SelectOptionGroup<T>>, getFlags: () => SelectGroupFlags) => JSX.Element;
        /**
         * Draws the box a group sits in, around its heading and its options, which are handed in to be placed inside it.
         * Refused alongside `computeEstimatedOptionHeight`, since a list that only draws what is on screen places each row
         * on its own and a group has no box there.
         */
        renderGroupBox?: (
            renderContent: () => JSX.Element,
            getGroup: Accessor<SelectOptionGroup<T>>,
            getFlags: () => SelectGroupFlags,
        ) => JSX.Element;
        /** Runs when an option is picked. */
        onPick: (value: T) => void;
    } & SelectGroupBoxExcludesWindowing;

export type ListboxPresetProps<T> = Omit<
    ListboxCompositeProps<T>,
    "selectedOptions" | "isMultiple" | "computeIsSelected" | "onPick"
> &
    SelectGroupBoxExcludesWindowing;

export type ListboxProps<T> = ListboxPresetProps<T> & {
    /** Which option is picked. It is the only thing that picks one. */
    value: SignalSource<T | undefined>;
    /** Runs when a different option is picked. */
    onSelectionChange?: (value: T) => void;
};
