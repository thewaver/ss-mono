import type { Store } from "@thewaver/ss-utils";

import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import type { VirtualizerRow } from "../../../Abstracts/Virtualizer/Virtualizer.types";
import type { SelectItemRecord, SelectOptionGroupRecord, SelectOptionRecord } from "../Select/Select.types";

export type ListboxFocusModel = "active_descendant" | "roving";

export type ListboxOrientation = "horizontal" | "vertical";

export type ListboxCursorState<T> = {
    highlightedValue: T | undefined;
    hasFocus: boolean;
    highlightRequests: number;
};

export type ListboxCursorController<T> = Store<ListboxCursorState<T>> & {
    getHighlightedIndex: () => number | undefined;
    setHasFocus: (hasFocus: boolean) => void;
    highlight: (value: T | undefined) => boolean;
    pick: (value: T) => boolean;
    handleKeyDown: (e: KeyboardEvent) => void;
    clear: () => void;
};

export type ListboxComboboxAttributes = {
    "role": "combobox";
    "aria-haspopup": "listbox";
    "aria-autocomplete": "list" | undefined;
    "aria-expanded": boolean;
    "aria-controls": string | undefined;
    "aria-activedescendant": string | undefined;
};

export type ListboxReachEndGuard<TOptions> = {
    claim: (options: TOptions) => boolean;
    reset: () => void;
};

export type ListboxCursorDefs<T, TTooltipDefs = unknown> = {
    focusModel: ListboxFocusModel;
    isHighlightExplicit?: boolean;
    getListboxId: () => string;
    getOptions: () => SelectItemRecord<T, TTooltipDefs>[];
    getSelectedOptions: () => SelectOptionRecord<T, TTooltipDefs>[];
    getIsDisabled: () => boolean;
    getIsMultiple?: () => boolean;
    getIsOpen?: () => boolean;
    getIsFilterable?: () => boolean;
    getIsFiltering?: () => boolean;
    getHasMoreOptions?: () => boolean;
    getOrientation?: () => ListboxOrientation;
    getDirection?: () => NavigatorDirection | undefined;
    computeCustomText?: (option: SelectOptionRecord<T, TTooltipDefs>) => string;
    onOpen?: () => void;
    onClose?: () => void;
    onPick: (value: T) => void;
};

export type ListboxWindowedRun<T, TTooltipDefs = unknown> = {
    groupIndex: number | undefined;
    group: SelectOptionGroupRecord<T, TTooltipDefs> | undefined;
    rows: VirtualizerRow[];
};

export type BaseListboxValues = {
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
    /** Whether there are more options to come, so the list can say so rather than looking finished. */
    hasMoreOptions?: boolean;
    /** How long either marker takes to slide from one option to the next, and to fade. */
    floaterTransitionDurationMs?: number;
};

export type BaseListboxCbs = {
    /** Runs when the reader reaches the end of the list, for a consumer fetching more options as they scroll. */
    onReachEnd?: () => void;
    /**
     * Guesses how tall an option will be before it is drawn, which is what lets a long list render only what is on
     * screen. The list has to sit inside something that scrolls. Only a vertical list is windowed.
     */
    computeEstimatedOptionHeight?: (index: number) => number;
    /** Guesses how tall a group heading will be before it is drawn, for the same reason. */
    computeEstimatedGroupHeight?: (index: number) => number;
};

export type BaseListboxProps = BaseListboxValues & BaseListboxCbs;
