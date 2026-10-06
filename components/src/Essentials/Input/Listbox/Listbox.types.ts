import type { Store } from "@thewaver/ss-utils";

import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import type { VirtualizerRow } from "../../../Abstracts/Virtualizer/Virtualizer.types";
import type { SelectItemRecord, SelectOptionGroupRecord, SelectOptionRecord } from "../Select/Select.types";

export type ListboxFocusModel = "activeDescendant" | "roving";

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
