import type { JSX } from "solid-js";

import type {
    BaseTextFieldCbs,
    BaseTextFieldFieldValues,
    BaseTextFieldValues,
    InteractionFlags,
    TextFieldFlags,
} from "@thewaver/ss-components";
import type { CSSPadding } from "@thewaver/ss-utils";

import type { AccessorProps, AccessorValues, SignalSource } from "../../Utils/typeUtils";
import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../InteractionWrapper/InteractionWrapperSolid.types";

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

export type TextFieldCbs = BaseTextFieldCbs & {
    /** Runs on a key pressed while the field has focus. */
    onKeyDown?: (e: KeyboardEvent) => void;
    /** Runs when the pointer arrives over the field. */
    onMouseEnter?: (e: MouseEvent) => void;
    /** Runs when the pointer leaves the field. */
    onMouseLeave?: (e: MouseEvent) => void;
    /** Styles the field's text against its current state. */
    computeTextStyle?: (getFlags: () => InteractionFlags<TextFieldFlags>) => TextFieldTextStyle;
    /** Draws the placeholder shown while the field is empty. */
    renderPlaceholder?: (getFlags: () => InteractionFlags<TextFieldFlags>, hint: string | undefined) => JSX.Element;
    /** Draws whatever sits before the text, inside the field. */
    renderLeading?: (getFlags: () => InteractionFlags<TextFieldFlags>) => JSX.Element;
    /** Draws whatever sits after the text, inside the field. */
    renderTrailing?: (getFlags: () => InteractionFlags<TextFieldFlags>) => JSX.Element;
};

export type TextFieldState = BaseTextFieldFieldValues & {
    /** What the browser may offer to fill the field with. */
    autoComplete?: JSX.HTMLAutocomplete;
};

export type TextFieldElementProps = AccessorValues<BaseTextFieldFieldValues> &
    TextFieldCbs &
    AccessorProps<
        Omit<InteractionControlProps<TextFieldFlags>, "ariaLabel"> &
            Pick<TextFieldState, "autoComplete"> & {
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
                /** ARIA attributes for the field element, for a preset that gives the field a role of its own. */
                ariaAttributes?: JSX.AriaAttributes;
            }
    >;

export type TextFieldProps = Omit<
    InteractionWrapperProps<TextFieldFlags>,
    "renderControl" | "extraFlags" | "minWidth" | "minHeight"
> &
    AccessorValues<BaseTextFieldValues> &
    TextFieldCbs &
    AccessorProps<
        Pick<InteractionControlProps<TextFieldFlags>, "id" | "renderContent"> &
            Pick<TextFieldState, "autoComplete"> & {
                /** The text in the field. It is the only thing that changes it. */
                value: SignalSource<string>;
                /**
                 * ARIA attributes for the field element, for a preset that gives the field a role of its own, such as a
                 * combobox. They are written after the field's own, so a role here replaces the one the field would
                 * have.
                 */
                ariaAttributes?: JSX.AriaAttributes;
            }
    >;

export type TextFieldPresetProps = Omit<
    TextFieldProps,
    | "element"
    | "isSpinButton"
    | "computeSpinValue"
    | "isAutoSizing"
    | "minRows"
    | "maxRows"
    | "isConcealed"
    | "onKeyDown"
    | "onBlur"
    | "ariaAttributes"
>;
