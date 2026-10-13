import type {
    AriaAttributes,
    AriaRole,
    CSSProperties,
    HTMLInputAutoCompleteAttribute,
    KeyboardEvent,
    MouseEvent,
    ReactNode,
} from "react";

import type {
    BaseTextFieldCbs,
    BaseTextFieldFieldValues,
    BaseTextFieldLayoutValues,
    InteractionFlags,
    TextFieldFlags,
    TextSyncElement,
} from "@thewaver/ss-components";
import type { CSSPadding } from "@thewaver/ss-utils";

import type { InteractionControlProps, InteractionWrapperProps } from "../InteractionWrapper/InteractionWrapper.types";

export type TextFieldTextStyle = Pick<
    CSSProperties,
    | "color"
    | "caretColor"
    | "fontFamily"
    | "fontSize"
    | "fontStyle"
    | "fontVariantNumeric"
    | "fontWeight"
    | "letterSpacing"
    | "lineHeight"
    | "textAlign"
    | "textTransform"
    | "wordSpacing"
>;

export type TextFieldAriaAttributes = AriaAttributes & {
    /** The role the field element takes instead of its own. */
    role?: AriaRole;
};

export type TextFieldCbs = BaseTextFieldCbs & {
    /** Styles the field's text against its current state. */
    computeTextStyle?: (flags: InteractionFlags<TextFieldFlags>) => TextFieldTextStyle;
    /** Draws the placeholder shown while the field is empty. */
    renderPlaceholder?: (flags: InteractionFlags<TextFieldFlags>, hint: string | undefined) => ReactNode;
    /** Draws whatever sits before the text, inside the field. */
    renderLeading?: (flags: InteractionFlags<TextFieldFlags>) => ReactNode;
    /** Draws whatever sits after the text, inside the field. */
    renderTrailing?: (flags: InteractionFlags<TextFieldFlags>) => ReactNode;
    /** Runs on a key pressed while the field has focus. */
    onKeyDown?: (e: KeyboardEvent<TextSyncElement>) => void;
    /** Runs when the pointer arrives over the field. */
    onMouseEnter?: (e: MouseEvent<TextSyncElement>) => void;
    /** Runs when the pointer leaves the field. */
    onMouseLeave?: (e: MouseEvent<TextSyncElement>) => void;
};

export type TextFieldState = BaseTextFieldFieldValues & {
    /** What the browser may offer to fill the field with. */
    autoComplete?: HTMLInputAutoCompleteAttribute;
};

export type TextFieldElementProps = TextFieldCbs &
    InteractionControlProps<TextFieldFlags> &
    TextFieldState & {
        /** The text currently in the field. */
        value: string;
        /** How far the text is inset, so it clears whatever is drawn before and after it. */
        textInset: CSSProperties;
        /** The padding to spread over the field's parts, so the consumer sets it once rather than per part. */
        spreadPadding: CSSPadding;
        /** Receives the leading element once it exists, so the field can measure it and inset the text past it. */
        setLeadingRef: (element: HTMLDivElement | null) => void;
        /** Receives the trailing element once it exists, for the same reason. */
        setTrailingRef: (element: HTMLDivElement | null) => void;
        /** ARIA attributes for the field element, for a preset that gives the field a role of its own. */
        ariaAttributes?: TextFieldAriaAttributes;
    };

export type TextFieldProps = Omit<
    InteractionWrapperProps<TextFieldFlags>,
    "renderControl" | "extraFlags" | "minWidth" | "minHeight"
> &
    TextFieldCbs &
    Pick<InteractionControlProps<TextFieldFlags>, "id" | "renderContent"> &
    TextFieldState &
    BaseTextFieldLayoutValues & {
        /** The text in the field, and how to change it. It is the only thing that changes it. */
        value: readonly [string, (value: string) => void];
        /**
         * ARIA attributes for the field element, for a preset that gives the field a role of its own, such as a
         * combobox. They are written after the field's own, so a role here replaces the one the field would have.
         */
        ariaAttributes?: TextFieldAriaAttributes;
    };

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
