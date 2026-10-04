import type { CSSProperties, ReactNode } from "react";

import type {
    AnchorPlacement,
    ButtonFlags,
    SelectOptionRecord as CoreSelectOption,
    SelectOptionGroupRecord as CoreSelectOptionGroup,
    SelectRowRecord as CoreSelectRow,
    InteractionFlags,
    SelectFlags,
    SelectGroupFlags,
    SelectOptionFlags,
} from "@thewaver/ss-components";
import type { CSSPadding, Point2d, Size2d } from "@thewaver/ss-utils";

import type {
    InteractionControlProps,
    InteractionTooltipDefs,
    InteractionWrapperProps,
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

export type SelectCompositeProps<T> = Omit<InteractionWrapperProps<SelectFlags>, "renderControl" | "extraFlags"> & {
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
    /** Whether more than one option can be picked at a time. */
    isMultiple?: boolean;
    /** Whether there are more options to come, so the list can say so rather than looking finished. */
    hasMoreOptions?: boolean;
    /** Styles the field's text against its current state. */
    computeTextStyle?: (flags: InteractionFlags<SelectFlags>) => TextFieldTextStyle;
    /** Whether the list is open, and how to change it. It is the only thing that opens or closes it. */
    visibility?: readonly [boolean, (isOpen: boolean) => void];
    /** What the reader has typed to narrow the list by, and how to change it. It is the only thing that changes it. */
    query?: readonly [string, (query: string) => void];
    /**
     * Guesses how tall an option will be before it is drawn, which is what lets a long list render only what is on
     * screen.
     */
    computeEstimatedOptionHeight?: (index: number) => number;
    /** Guesses how tall a group heading will be before it is drawn, for the same reason. */
    computeEstimatedGroupHeight?: (index: number) => number;
    /** How long either marker takes to slide from one option to the next, and to fade. */
    floaterTransitionDurationMs?: number;
    /**
     * Draws the marker that slides to the selected option in the open list, behind it. The fade is handed in rather
     * than applied: the marker fades out when nothing is selected, and in a list that only draws what is on screen
     * it fades out while the selected option is scrolled away and back in when it returns. Where several options
     * are selected, it follows the first of them.
     */
    renderSelectionFloater?: (visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;
    /**
     * Draws the marker that slides to the highlighted option in the open list — the one the pointer or the arrow
     * keys are on — behind it, drawn under the selection's marker where both are given. It fades out while nothing
     * is highlighted, and in a list that only draws what is on screen, while the highlighted option is scrolled
     * away.
     */
    renderHighlightFloater?: (visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;
    /**
     * Draws the surface the options sit on. The options are handed in rather than built, so the consumer decides
     * what surrounds them.
     */
    renderPopup: (
        renderOptions: () => ReactNode,
        visibilityTarget: 0 | 1,
        transitionDurationMs: number,
        placement: AnchorPlacement,
        flags: InteractionFlags<SelectFlags>,
    ) => ReactNode;
    /** Runs when the reader reaches the end of the list, for a consumer fetching more options as they scroll. */
    onReachEnd?: () => void;
    /** Names the clear control for assistive technology, where what it draws has no text of its own. */
    clearAriaLabel?: string;
    /**
     * Draws a control inside the field that empties it, and is handed that control's own state. It is drawn only
     * while something is picked, sits after the field as a tab stop of its own, and pressing it empties the value,
     * runs the change callback and returns focus to the field. Escape and the arrow keys do nothing on it. It is
     * laid over the field's end edge and is not measured, so the field's `padding` has to leave room for it.
     */
    renderClear?: (flags: InteractionFlags<ButtonFlags>) => ReactNode;
    /** The options, in the order they are shown. An entry carrying children becomes a group. */
    options: SelectItem<T>[];
    /** Which options are currently picked. */
    selectedOptions: SelectOption<T>[];
    /** Whether a given value counts as picked, for a consumer whose values are not compared by identity. */
    computeIsSelected: (value: T) => boolean;
    /** The text an option is found by when the reader types, where that is not its visible text. */
    computeCustomText?: (option: SelectOption<T>) => string;
    /** Draws the field, and is handed everything that is picked. */
    renderContent: (selectedOptions: SelectOption<T>[], flags: InteractionFlags<SelectFlags>) => ReactNode;
    /** Draws one option. */
    renderOption: (option: SelectOption<T>, flags: InteractionFlags<SelectOptionFlags>) => ReactNode;
    /** Draws one group heading. */
    renderGroup?: (group: SelectOptionGroup<T>, flags: SelectGroupFlags) => ReactNode;
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
    /** Which option is picked, and how to change it. It is the only thing that picks one. */
    value: readonly [T | undefined, (value: T | undefined) => void];
    /** Draws the field, and is handed the one option that is picked. */
    renderContent: (selectedOption: SelectOption<T> | undefined, flags: InteractionFlags<SelectFlags>) => ReactNode;
    /** Runs when a different option is picked, and with `undefined` when the clear control empties the field. */
    onSelectionChange?: (value: T | undefined) => void;
};
