import type { CSSLogicalPadding } from "@thewaver/ss-utils";

import type { TextSyncMaskResult } from "../../Abstracts/TextSync/TextSync.types";

export type TextFieldElementType = "input" | "textarea";

export type TextFieldType = "text" | "email" | "number" | "password" | "search" | "tel" | "url";

export type TextFieldFlags = {
    isEmpty: boolean;
    isReadOnly: boolean;
};

export type TextFieldMode = "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";

export type BaseTextFieldFieldValues = {
    /** Whether the field is a single line or a box that takes several. */
    element: TextFieldElementType;
    /** What kind of value the field holds, which decides the keyboard a phone offers and how the browser treats it. */
    type?: TextFieldType;
    /** The field's name when it is submitted as part of a form. */
    name?: string;
    /** Names the field for assistive technology, where no label already does. */
    ariaLabel?: string;
    /** Whether the value can be read and copied but not changed. Unlike disabling it, the field stays focusable. */
    isReadOnly?: boolean;
    /** Whether a value has to be given. It is announced and not enforced, because the library validates nothing. */
    isRequired?: boolean;
    /**
     * Whether the field announces itself as something with a value to step up and down, which is what a number field
     * is.
     */
    isSpinButton?: boolean;
    /** Which keyboard a phone should offer for the field. */
    inputMode?: TextFieldMode;
    /** A hint shown alongside the placeholder, for a format the reader has to match. */
    placeholderHint?: string;
    /** The smallest value the field will settle on. */
    min?: number;
    /** The largest value the field will settle on. */
    max?: number;
    /** How far one step moves the value. */
    step?: number;
    /** Whether the field grows to fit what has been typed rather than keeping a fixed size. */
    isAutoSizing?: boolean;
    /** The fewest rows a multi-line field shows. */
    minRows?: number;
    /** The most rows a multi-line field grows to before it starts scrolling. */
    maxRows?: number;
    /**
     * Whether the element draws nothing of its own: no text, no caret, no selection highlight and no focus outline.
     * For a control whose painter draws all four from state the control reports, so the element's own paint would
     * show a second, misplaced copy.
     */
    isConcealed?: boolean;
    /**
     * Whether the text runs left to right whatever the direction of the text around the field, so the caret, the
     * arrow keys and the characters keep that order in right-to-left text too. For a value written in Latin letters
     * and digits that is never read the other way, such as a one-time code.
     */
    isLeftToRight?: boolean;
};

export type BaseTextFieldLayoutValues = {
    /**
     * How much room is left inside the field, around its text. Its sides follow the text, as CSS's
     * `padding-inline-start` and its siblings do: in right-to-left text the inline start is on the right, and the
     * leading and trailing slots move with it.
     */
    padding?: CSSLogicalPadding | number;
    /** The space between the text and whatever sits before or after it. */
    gap?: number;
};

export type BaseTextFieldValues = BaseTextFieldFieldValues & BaseTextFieldLayoutValues;

export type BaseTextFieldCbs = {
    /**
     * Rewrites what the reader typed before it is accepted, and says where the caret should end up — which is how a
     * field formats as you type without the caret jumping.
     */
    computeMaskedText?: (previous: string, next: string, caret: number) => TextSyncMaskResult;
    /**
     * Reads the field's text as the number a spin button announces holding, for text not written the way `Number`
     * reads it — a decimal comma, or grouped thousands. Answer `undefined` for text that is not a number yet. Left
     * out, the text is read with `Number`. Only means anything on a spin button.
     */
    computeSpinValue?: (text: string) => number | undefined;
    /** Runs as the reader types. */
    onInput?: (value: string) => void;
    /** Runs when the field loses focus, which is where a field that clamps its value does so. */
    onBlur?: () => void;
};

export type BaseTextFieldProps = BaseTextFieldValues & BaseTextFieldCbs;
