import type { Accessor, JSX } from "solid-js";

import type {
    AnchorPlacement,
    BaseSelectCbs,
    BaseSelectValues,
    ButtonFlags,
    InteractionFlags,
    SelectFlags,
    SelectGroupFlags,
    SelectItemRecord,
    SelectOptionFlags,
    SelectOptionGroupRecord,
    SelectOptionRecord,
    SelectRowRecord,
} from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionTooltipDefs,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { TextFieldTextStyle } from "../../../Primitives/TextField/TextFieldSolid.types";
import type { AccessorProps, AccessorValues, MaybeAccessor, SignalSource } from "../../../Utils/typeUtils";

export type SelectOption<T, TTooltipDefs = InteractionTooltipDefs<SelectOptionFlags>> = SelectOptionRecord<
    T,
    TTooltipDefs
>;

export type SelectOptionGroup<T, TTooltipDefs = InteractionTooltipDefs<SelectOptionFlags>> = SelectOptionGroupRecord<
    T,
    TTooltipDefs
>;

export type SelectItem<T, TTooltipDefs = InteractionTooltipDefs<SelectOptionFlags>> = SelectItemRecord<T, TTooltipDefs>;

export type SelectRow<T, TTooltipDefs = InteractionTooltipDefs<SelectOptionFlags>> = SelectRowRecord<T, TTooltipDefs>;

export type SelectFieldProps = AccessorValues<Pick<BaseSelectValues, "ariaLabel" | "isRequired">> &
    AccessorProps<
        Omit<InteractionControlProps<SelectFlags>, "ariaLabel"> & {
            /** Identifies the list the field opens, so the field can point at it. */
            listboxId: string;
            /**
             * Identifies the option the keyboard is currently on, which is how the reader is told what is highlighted
             * without focus leaving the field.
             */
            activeOptionId: string | undefined;
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

export type SelectCompositeProps<T> = Omit<InteractionWrapperProps<SelectFlags>, "renderControl" | "extraFlags"> &
    AccessorValues<BaseSelectValues> &
    BaseSelectCbs &
    AccessorProps<{
        /** Whether more than one option can be picked at a time. */
        isMultiple?: boolean;
        /** Styles the field's text against its current state. */
        computeTextStyle?: (getFlags: () => InteractionFlags<SelectFlags>) => TextFieldTextStyle;
        /** Whether the list is open. It is the only thing that opens or closes it. */
        visibility?: SignalSource<boolean>;
        /** What the reader has typed to narrow the list by. It is the only thing that changes the query. */
        query?: SignalSource<string>;
        /**
         * Draws the marker that slides to the selected option in the open list, behind it. The fade is handed in rather
         * than applied: the marker fades out when nothing is selected, and in a list that only draws what is on screen
         * it fades out while the selected option is scrolled away and back in when it returns. Where several options
         * are selected, it follows the first of them.
         */
        renderSelectionFloater?: (
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
        /**
         * Draws the marker that slides to the highlighted option in the open list — the one the pointer or the arrow
         * keys are on — behind it, drawn under the selection's marker where both are given. It fades out while nothing
         * is highlighted, and in a list that only draws what is on screen, while the highlighted option is scrolled
         * away.
         */
        renderHighlightFloater?: (
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
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
        /**
         * Draws a control inside the field that empties it, and is handed that control's own state. It is drawn only
         * while something is picked, sits after the field as a tab stop of its own, and pressing it empties the value,
         * runs the change callback and returns focus to the field. Escape and the arrow keys do nothing on it. It is
         * laid over the field's end edge and is not measured, so the field's `padding` has to leave room for it.
         */
        renderClear?: (getFlags: () => InteractionFlags<ButtonFlags>) => JSX.Element;
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
        /** Runs when the clear control is pressed, to empty whatever is picked. */
        onClear: () => void;
    };

export type SelectPresetProps<T> = Omit<
    SelectCompositeProps<T>,
    "selectedOptions" | "isMultiple" | "computeIsSelected" | "renderContent" | "onPick" | "onClear"
>;

export type SelectProps<T> = SelectPresetProps<T> & {
    /** Which option is picked. It is the only thing that picks one. */
    value: SignalSource<T | undefined>;
    /** Draws the field, and is handed the one option that is picked. */
    renderContent: (
        getSelectedOption: Accessor<SelectOption<T> | undefined>,
        getFlags: () => InteractionFlags<SelectFlags>,
    ) => JSX.Element;
    /** Runs when a different option is picked, and with `undefined` when the clear control empties the field. */
    onSelectionChange?: (value: T | undefined) => void;
};
