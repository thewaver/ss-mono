import type { Snippet } from "svelte";
import type { InteractionFlags, ListboxFocusModel, ListboxOrientation, SelectGroupFlags, SelectOptionFlags } from "@thewaver/ss-components";
import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";
import type { SelectItem, SelectOption, SelectOptionGroup, SelectRow } from "../Select/Select.types.js";
export type ListboxCursor<T> = {
    focusModel: ListboxFocusModel;
    getListboxId: () => string;
    getOrientation: () => ListboxOrientation;
    getOptions: () => SelectItem<T>[];
    getItemRows: () => SelectRow<T>[];
    getRows: () => SelectRow<T>[];
    getFlatOptions: () => SelectOption<T>[];
    getHighlightedIndex: () => number | undefined;
    getIsHighlightShown: () => boolean;
    getActiveOptionId: () => string | undefined;
    getOptionId: (index: number) => string;
    setHasFocus: (hasFocus: boolean) => void;
    highlight: (value: T | undefined) => boolean;
    pick: (value: T) => boolean;
    handleKeyDown: (e: KeyboardEvent) => void;
};
export type ListboxOptionItemProps = InteractionControlProps<SelectOptionFlags> & {
    /**
     * Whether this option scrolls itself into view when it becomes the highlighted one, which a list that windows its
     * options does for itself.
     */
    isSelfScrolling: boolean;
    /** Runs when this option takes focus, which is how a list whose options hold focus learns where the reader is. */
    onFocus?: () => void;
    /** Runs when this option is picked. */
    onSelect: () => void;
};
export type ListboxOptionsProps<T> = {
    /**
     * Whether the list is on screen and taking part. A list inside a popup is live only while the popup is open, so a
     * closing fade neither windows, nor loads more, nor scrolls.
     */
    isLive: boolean;
    /** Whether the whole list is disabled, so every option is drawn and announced as unavailable. */
    isDisabled?: boolean;
    /** Whether there are more options to come, so the list can say so rather than looking finished. */
    hasMoreOptions?: boolean;
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
     * The list's state, from `ListboxSvelteUtils.createCursor`: what is highlighted, and how the keyboard walks it.
     */
    cursor: ListboxCursor<T>;
    /** Whether a given value counts as picked, for a consumer whose values are not compared by identity. */
    computeIsSelected: (value: T) => boolean;
    /** Draws one option. */
    renderOption: Snippet<[option: SelectOption<T>, flags: InteractionFlags<SelectOptionFlags>]>;
    /** Draws one group heading. */
    renderGroup?: Snippet<[group: SelectOptionGroup<T>, flags: SelectGroupFlags]>;
};
export type ListboxCompositeProps<T> = {
    /** Identifies the list, and is what each option composes its own id from. Left out, one is generated. */
    id?: string;
    /** Names the list for assistive technology. A listbox has to be named, so this cannot be left out. */
    ariaLabel: string;
    /**
     * Whether the list refuses every pick. Its options are drawn and announced as unavailable, and none of them is a
     * tab stop.
     */
    isDisabled?: boolean;
    /**
     * Which way the options run, and so which arrows walk them. A horizontal list follows the page's text direction,
     * so in a right-to-left layout the left arrow moves forward.
     */
    orientation?: ListboxOrientation;
    /** Whether more than one option can be picked at a time. */
    isMultiple?: boolean;
    /** Whether there are more options to come, so the list can say so rather than looking finished. */
    hasMoreOptions?: boolean;
    /** Runs when the reader reaches the end of the list, for a consumer fetching more options as they scroll. */
    onReachEnd?: () => void;
    /**
     * Guesses how tall an option will be before it is drawn, which is what lets a long list render only what is on
     * screen. The list has to sit inside something that scrolls. Only a vertical list is windowed.
     */
    computeEstimatedOptionHeight?: (index: number) => number;
    /** Guesses how tall a group heading will be before it is drawn, for the same reason. */
    computeEstimatedGroupHeight?: (index: number) => number;
    /** The options, in the order they are shown. An entry carrying children becomes a group. */
    options: SelectItem<T>[];
    /** Which options are currently picked. */
    selectedOptions: SelectOption<T>[];
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
    renderOption: Snippet<[option: SelectOption<T>, flags: InteractionFlags<SelectOptionFlags>]>;
    /** Draws one group heading. */
    renderGroup?: Snippet<[group: SelectOptionGroup<T>, flags: SelectGroupFlags]>;
    /** Runs when an option is picked. */
    onPick: (value: T) => void;
};
export type ListboxPresetProps<T> = Omit<ListboxCompositeProps<T>, "selectedOptions" | "isMultiple" | "computeIsSelected" | "onPick">;
export type ListboxProps<T> = ListboxPresetProps<T> & {
    /** Which option is picked. Bind it with `bind:value`; it is the only thing that picks one. */
    value: T | undefined;
    /** Runs when a different option is picked. */
    onSelectionChange?: (value: T) => void;
};
