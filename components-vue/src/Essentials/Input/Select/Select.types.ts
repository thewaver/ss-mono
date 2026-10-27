import type { CSSProperties, VNodeChild } from "vue";

import type {
    AnchorPlacement,
    BaseSelectProps,
    ButtonFlags,
    SelectOptionRecord as CoreSelectOption,
    SelectOptionGroupRecord as CoreSelectOptionGroup,
    SelectRowRecord as CoreSelectRow,
    InteractionFlags,
    SelectFlags,
    SelectGroupFlags,
    SelectOptionFlags,
} from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionTooltipDefs,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { TextFieldTextStyle } from "../../../Primitives/TextField/TextField.types";

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
    /**
     * Whether the reader is typing, so the field holds what they typed. Otherwise it holds the text of what is
     * picked, which is what a screen reader reads as the field's value.
     */
    isEditing: boolean;
    /**
     * The text of what is picked, where the consumer gave one. Without it the field takes the text the consumer
     * painted for the picked option; an empty string keeps the field empty.
     */
    valueText: string | undefined;
    /** How far the field's text is inset, so it clears whatever the consumer has drawn inside the field. */
    textInset: CSSProperties;
    /** Styles the field's text against its current state. */
    computeTextStyle?: (flags: InteractionFlags<SelectFlags>) => TextFieldTextStyle;
    /** Runs when the field is activated and the list should open or close. */
    onToggle: () => void;
    /** Runs on a key pressed while the field has focus, which is what walks and picks from the list. */
    onKeyDown: (e: KeyboardEvent) => void;
    /** Runs as the reader types into a filterable field. */
    onQueryInput: (query: string) => void;
};

export type SelectCompositeProps<T> = Omit<InteractionWrapperProps<SelectFlags>, "extraFlags"> &
    BaseSelectProps & {
        /** Whether more than one option can be picked at a time. */
        "isMultiple"?: boolean;
        /** Styles the field's text against its current state. */
        "computeTextStyle"?: (flags: InteractionFlags<SelectFlags>) => TextFieldTextStyle;
        /**
         * Whether the list is open, which is what `v-model:visibility` binds. Left unbound, the select keeps its own. It
         * is the only thing that opens or closes it.
         */
        "visibility"?: boolean;
        /** Receives the list opening or closing. */
        "onUpdate:visibility"?: (isOpen: boolean) => void;
        /**
         * What the reader has typed to narrow the list by, which is what `v-model:query` binds. Given, the field becomes
         * a text field that filters; left out, typing jumps to a match. It is the only thing that changes it.
         */
        "query"?: string;
        /** Receives what the reader types into a filterable field. */
        "onUpdate:query"?: (query: string) => void;
        /** The options, in the order they are shown. An entry carrying children becomes a group. */
        "options": SelectItem<T>[];
        /** Which options are currently picked. */
        "selectedOptions": SelectOption<T>[];
        /** Whether a given value counts as picked, for a consumer whose values are not compared by identity. */
        "computeIsSelected": (value: T) => boolean;
        /** The text an option is found by when the reader types, where that is not its visible text. */
        "computeCustomText"?: (option: SelectOption<T>) => string;
        /**
         * The text an option's value is submitted as, for a select given a `name`. Left out, a string goes as it is, a
         * number or a boolean as its plain spelling, and anything else as JSON, which throws for a value JSON cannot
         * write, such as a circular object. Pass it where the server wants something other than that, such as a
         * record's id.
         */
        "computeFormValue"?: (value: T) => string;
        /** Runs when an option is picked. */
        "onPick": (value: T) => void;
        /** Runs when the clear control is pressed, to empty whatever is picked. */
        "onClear": () => void;
    };

export type SelectPresetSlots<T> = Pick<InteractionWrapperSlots<SelectFlags>, "renderDecoration"> & {
    /**
     * Draws the surface the options sit on. The options are handed in rather than built, so the consumer decides
     * what surrounds them: `renderOptions` draws them, from a template as `<component :is="renderOptions" />`.
     */
    renderPopup: (props: {
        renderOptions: () => VNodeChild;
        visibilityTarget: 0 | 1;
        transitionDurationMs: number;
        placement: AnchorPlacement;
        flags: InteractionFlags<SelectFlags>;
    }) => VNodeChild;
    /**
     * Draws a control inside the field that empties it, and is handed that control's own state. It is drawn only
     * while something is picked, sits after the field as a tab stop of its own, and pressing it empties the value,
     * runs the change callback and returns focus to the field. Escape and the arrow keys do nothing on it. It is
     * laid over the field's end edge and is not measured, so the field's `padding` has to leave room for it.
     */
    renderClear?: (flags: InteractionFlags<ButtonFlags>) => VNodeChild;
    /** Draws one option. */
    renderOption: (props: { option: SelectOption<T>; flags: InteractionFlags<SelectOptionFlags> }) => VNodeChild;
    /** Draws one group heading. */
    renderGroupHeader?: (props: { group: SelectOptionGroup<T>; flags: SelectGroupFlags }) => VNodeChild;
    /**
     * Draws the box a group sits in, around its heading and its options. They are handed in rather than built, so the
     * consumer decides what surrounds them: `renderContent` draws them, from a template as
     * `<component :is="renderContent" />`. Refused alongside `computeEstimatedOptionHeight`, since a list that only
     * draws what is on screen places each row on its own and a group has no box there.
     */
    renderGroupBox?: (props: {
        renderContent: () => VNodeChild;
        group: SelectOptionGroup<T>;
        flags: SelectGroupFlags;
    }) => VNodeChild;
    /**
     * Draws the marker that slides to the selected option in the open list, behind it. The fade is handed in rather
     * than applied: the marker fades out when nothing is selected, and in a list that only draws what is on screen
     * it fades out while the selected option is scrolled away and back in when it returns. Where several options
     * are selected, it follows the first of them.
     */
    renderSelectionFloater?: (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;
    /**
     * Draws the marker that slides to the highlighted option in the open list — the one the pointer or the arrow
     * keys are on — behind it, drawn under the selection's marker where both are given. It fades out while nothing
     * is highlighted, and in a list that only draws what is on screen, while the highlighted option is scrolled
     * away.
     */
    renderHighlightFloater?: (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;
};

export type SelectCompositeSlots<T> = SelectPresetSlots<T> & {
    /** Draws the field, and is handed everything that is picked. */
    renderContent: (props: { selectedOptions: SelectOption<T>[]; flags: InteractionFlags<SelectFlags> }) => VNodeChild;
};

export type SelectPresetProps<T> = Omit<
    SelectCompositeProps<T>,
    "selectedOptions" | "isMultiple" | "computeIsSelected" | "onPick" | "onClear"
>;

export type SelectProps<T> = SelectPresetProps<T> & {
    /** Which option is picked, which is what `v-model:value` binds. It is the only thing that picks one. */
    "value": T | undefined;
    /** Receives the option picked, and `undefined` when the clear control empties the field. */
    "onUpdate:value"?: (value: T | undefined) => void;
    /** Runs when a different option is picked, and with `undefined` when the clear control empties the field. */
    "onSelectionChange"?: (value: T | undefined) => void;
};

export type SelectSlots<T> = SelectPresetSlots<T> & {
    /** Draws the field, and is handed the one option that is picked. */
    renderContent: (props: {
        selectedOption: SelectOption<T> | undefined;
        flags: InteractionFlags<SelectFlags>;
    }) => VNodeChild;
};
