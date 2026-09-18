import type { JSX } from "solid-js";

import type { CSSPadding } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { TextSyncMaskResult } from "../../Abstracts/TextSync/TextSync.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";
import type { InteractionControlProps, InteractionWrapperProps } from "../InteractionWrapper/InteractionWrapper.types";

export type TextFieldElementType = "input" | "textarea";

export type TextFieldType = "text" | "email" | "number" | "password" | "search" | "tel" | "url";

export type TextFieldFlags = {
    isEmpty: boolean;
    isReadOnly: boolean;
};

export type TextFieldMode = "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";

export type TextFieldTextStyle = Pick<
    JSX.CSSProperties,
    | "color"
    | "caret-color"
    | "font-family"
    | "font-size"
    | "font-style"
    | "font-variant-numeric"
    | "font-weight"
    | "letter-spacing"
    | "line-height"
    | "text-align"
    | "text-transform"
    | "word-spacing"
>;

export type TextFieldCbs = {
    /**
     * Rewrites what the reader typed before it is accepted, and says where the caret should end up — which is how a
     * field formats as you type without the caret jumping.
     */
    computeMaskedText?: (previous: string, next: string, caret: number) => TextSyncMaskResult;
    /** Styles the field's text against its current state. */
    computeTextStyle?: (getFlags: () => InteractionFlags<TextFieldFlags>) => TextFieldTextStyle;
    /** Draws the placeholder shown while the field is empty. */
    renderPlaceholder?: (getFlags: () => InteractionFlags<TextFieldFlags>, hint: string | undefined) => JSX.Element;
    /** Draws whatever sits before the text, inside the field. */
    renderLeading?: (getFlags: () => InteractionFlags<TextFieldFlags>) => JSX.Element;
    /** Draws whatever sits after the text, inside the field. */
    renderTrailing?: (getFlags: () => InteractionFlags<TextFieldFlags>) => JSX.Element;
    /** Runs as the reader types. */
    onInput?: (value: string) => void | Promise<void>;
    /** Runs on a key pressed while the field has focus. */
    onKeyDown?: (e: KeyboardEvent) => void | Promise<void>;
    /** Runs when the field loses focus, which is where a field that clamps its value does so. */
    onBlur?: () => void | Promise<void>;
    /** Runs when the pointer arrives over the field. */
    onMouseEnter?: (e: MouseEvent) => void | Promise<void>;
    /** Runs when the pointer leaves the field. */
    onMouseLeave?: (e: MouseEvent) => void | Promise<void>;
};

export type TextFieldState = {
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
    /**
     * Whether the field announces itself as something with a value to step up and down, which is what a number field
     * is.
     */
    isSpinButton?: boolean;
    /** What the browser may offer to fill the field with. */
    autoComplete?: JSX.HTMLAutocomplete;
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
};

export type TextFieldElementProps = AccessorProps<
    TextFieldCbs &
        InteractionControlProps<TextFieldFlags> &
        TextFieldState & {
            /** The text currently in the field. */
            value: string;
            /** How far the text is inset, so it clears whatever is drawn before and after it. */
            textInset: JSX.CSSProperties;
            /** The padding to spread over the field's parts, so the consumer sets it once rather than per part. */
            spreadPadding: CSSPadding;
            /** Receives the leading element once it exists, so the field can measure it and inset the text past it. */
            setLeadingRef: (element: HTMLElement) => void;
            /** Receives the trailing element once it exists, for the same reason. */
            setTrailingRef: (element: HTMLElement) => void;
        }
>;

export type TextFieldProps = Omit<
    InteractionWrapperProps<TextFieldFlags>,
    "renderControl" | "extraFlags" | "minWidth" | "minHeight"
> &
    AccessorProps<
        TextFieldCbs &
            Pick<InteractionControlProps<TextFieldFlags>, "id" | "renderContent"> &
            TextFieldState & {
                /** How much room is left inside the field, around its text. */
                padding?: CSSPadding | number;
                /** The space between the text and whatever sits before or after it. */
                gap?: number;
                /** The text in the field. It is the only thing that changes it. */
                valueSignal: SignalSource<string>;
            }
    >;

export type TextFieldPresetProps = Omit<
    TextFieldProps,
    "element" | "isSpinButton" | "isAutoSizing" | "minRows" | "maxRows" | "onKeyDown" | "onBlur"
>;
