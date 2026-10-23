import type { Snippet } from "svelte";

import type {
    AnchorPlacement,
    BaseSelectProps,
    ButtonFlags,
    SelectOptionRecord as CoreSelectOption,
    SelectOptionGroupRecord as CoreSelectOptionGroup,
    SelectRowRecord as CoreSelectRow,
    InteractionFlags,
    SelectFlags,
    SelectGroupBoxExcludesWindowing,
    SelectGroupFlags,
    SelectOptionFlags,
} from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionTooltipDefs,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";
import type { TextFieldTextStyle } from "../../../Primitives/TextField/TextField.types.js";

export type SelectOptionTooltipDefs = InteractionTooltipDefs<SelectOptionFlags>;

export type SelectOption<T> = CoreSelectOption<T, SelectOptionTooltipDefs>;

export type SelectOptionGroup<T> = CoreSelectOptionGroup<T, SelectOptionTooltipDefs>;

export type SelectItem<T> = SelectOption<T> | SelectOptionGroup<T>;

export type SelectRow<T> = CoreSelectRow<T, SelectOptionTooltipDefs>;

export type SelectFieldProps = InteractionControlProps<SelectFlags> & {
    /** Identifies the list the field opens, so the field can point at it. */
    listboxId: string;
    /** Whether a value has to be given. It is announced and not enforced, because the library validates nothing. */
    isRequired?: boolean;
    /**
     * Identifies the option the keyboard is currently on, which is how the reader is told what is highlighted
     * without focus leaving the field.
     */
    activeOptionId: string | undefined;
    /** Whether typing in the field narrows the list rather than jumping to a match. */
    isFilterable: boolean;
    /** What the reader has typed to narrow the list by. */
    query: string;
    /** How far the field's text is inset, as a style, so it clears whatever the consumer has drawn inside the field. */
    textInset: string;
    /** Styles the field's text against its current state. */
    computeTextStyle?: (flags: InteractionFlags<SelectFlags>) => TextFieldTextStyle;
    /** Runs when the field is activated and the list should open or close. */
    onToggle: () => void;
    /** Runs on a key pressed while the field has focus, which is what walks and picks from the list. */
    onKeyDown: (e: KeyboardEvent) => void;
    /** Runs as the reader types into a filterable field. */
    onQueryInput: (query: string) => void;
};

export type SelectCompositeProps<T> = Omit<InteractionWrapperProps<SelectFlags>, "renderControl" | "extraFlags"> &
    BaseSelectProps & {
        /** Whether more than one option can be picked at a time. */
        isMultiple?: boolean;
        /** Styles the field's text against its current state. */
        computeTextStyle?: (flags: InteractionFlags<SelectFlags>) => TextFieldTextStyle;
        /**
         * Whether the list is open. Bind it with `bind:visibility` to drive or follow it; left unbound, the select keeps
         * its own. It is the only thing that opens or closes the list.
         */
        visibility?: boolean;
        /**
         * What the reader has typed to narrow the list by. Bind it with `bind:query`; binding it is what makes the field
         * filterable, and it is the only thing that changes the text.
         */
        query?: string;
        /**
         * Draws the marker that slides to the selected option in the open list, behind it. The fade is handed in rather
         * than applied: the marker fades out when nothing is selected, and in a list that only draws what is on screen
         * it fades out while the selected option is scrolled away and back in when it returns. Where several options
         * are selected, it follows the first of them.
         */
        renderSelectionFloater?: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;
        /**
         * Draws the marker that slides to the highlighted option in the open list — the one the pointer or the arrow
         * keys are on — behind it, drawn under the selection's marker where both are given. It fades out while nothing
         * is highlighted, and in a list that only draws what is on screen, while the highlighted option is scrolled
         * away.
         */
        renderHighlightFloater?: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;
        /**
         * Draws the surface the options sit on. The options are handed in as a snippet rather than built, so the consumer
         * decides what surrounds them, and draws them with `{@render renderOptions()}`.
         */
        renderPopup: Snippet<
            [
                renderOptions: Snippet,
                visibilityTarget: 0 | 1,
                transitionDurationMs: number,
                placement: AnchorPlacement,
                flags: InteractionFlags<SelectFlags>,
            ]
        >;
        /**
         * Draws a control inside the field that empties it, and is handed that control's own state. It is drawn only
         * while something is picked, sits after the field as a tab stop of its own, and pressing it empties the value,
         * runs the change callback and returns focus to the field. Escape and the arrow keys do nothing on it. It is
         * laid over the field's end edge and is not measured, so the field's `padding` has to leave room for it.
         */
        renderClear?: Snippet<[flags: InteractionFlags<ButtonFlags>]>;
        /** The options, in the order they are shown. An entry carrying children becomes a group. */
        options: SelectItem<T>[];
        /** Which options are currently picked. */
        selectedOptions: SelectOption<T>[];
        /** Whether a given value counts as picked, for a consumer whose values are not compared by identity. */
        computeIsSelected: (value: T) => boolean;
        /** The text an option is found by when the reader types, where that is not its visible text. */
        computeCustomText?: (option: SelectOption<T>) => string;
        /** Draws the field, and is handed everything that is picked. */
        renderContent: Snippet<[selectedOptions: SelectOption<T>[], flags: InteractionFlags<SelectFlags>]>;
        /** Draws one option. */
        renderOption: Snippet<[option: SelectOption<T>, flags: InteractionFlags<SelectOptionFlags>]>;
        /** Draws one group heading. */
        renderGroupHeader?: Snippet<[group: SelectOptionGroup<T>, flags: SelectGroupFlags]>;
        /**
         * Draws the box a group sits in, around its heading and its options. They are handed in as a snippet rather than
         * built, so the consumer decides what surrounds them, and draws them with `{@render renderContent()}`. Refused
         * alongside `computeEstimatedOptionHeight`, since a list that only draws what is on screen places each row on its
         * own and a group has no box there.
         */
        renderGroupBox?: Snippet<[renderContent: Snippet, group: SelectOptionGroup<T>, flags: SelectGroupFlags]>;
        /** Runs when an option is picked. */
        onPick: (value: T) => void;
        /** Runs when the clear control is pressed, to empty whatever is picked. */
        onClear: () => void;
    } & SelectGroupBoxExcludesWindowing;

export type SelectPresetProps<T> = Omit<
    SelectCompositeProps<T>,
    "selectedOptions" | "isMultiple" | "computeIsSelected" | "renderContent" | "onPick" | "onClear"
> &
    SelectGroupBoxExcludesWindowing;

export type SelectProps<T> = SelectPresetProps<T> & {
    /** Which option is picked. Bind it with `bind:value`; it is the only thing that picks one. */
    value: T | undefined;
    /** Draws the field, and is handed the one option that is picked. */
    renderContent: Snippet<[selectedOption: SelectOption<T> | undefined, flags: InteractionFlags<SelectFlags>]>;
    /** Runs when a different option is picked, and with `undefined` when the clear control empties the field. */
    onSelectionChange?: (value: T | undefined) => void;
};
