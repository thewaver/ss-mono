import type { AriaAttributes, CSSProperties, VNodeChild } from "vue";

import type {
    BaseTextFieldCbs,
    BaseTextFieldFieldValues,
    BaseTextFieldLayoutValues,
    InteractionFlags,
    TextFieldFlags,
} from "@thewaver/ss-components";
import type { CSSLogicalPadding } from "@thewaver/ss-utils";

import type {
    InteractionControlProps,
    InteractionControlSlots,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../InteractionWrapper/InteractionWrapper.types";

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
    role?: string;
};

export type TextFieldCbs = BaseTextFieldCbs & {
    /** Runs on a key pressed while the field has focus. */
    onKeyDown?: (e: KeyboardEvent) => void;
    /** Runs when the pointer arrives over the field. */
    onMouseEnter?: (e: MouseEvent) => void;
    /** Runs when the pointer leaves the field. */
    onMouseLeave?: (e: MouseEvent) => void;
    /** Styles the field's text against its current state. */
    computeTextStyle?: (flags: InteractionFlags<TextFieldFlags>) => TextFieldTextStyle;
};

export type TextFieldAdornmentSlots = {
    /** Draws the placeholder shown while the field is empty, handed the hint to show beside it. */
    renderPlaceholder?: (props: { flags: InteractionFlags<TextFieldFlags>; hint: string | undefined }) => VNodeChild;
    /** Draws whatever sits before the text, inside the field. */
    renderLeading?: (flags: InteractionFlags<TextFieldFlags>) => VNodeChild;
    /** Draws whatever sits after the text, inside the field. */
    renderTrailing?: (flags: InteractionFlags<TextFieldFlags>) => VNodeChild;
};

export type TextFieldState = BaseTextFieldFieldValues & {
    /** What the browser may offer to fill the field with. */
    autoComplete?: string;
};

export type TextFieldElementProps = TextFieldCbs &
    InteractionControlProps<TextFieldFlags> &
    TextFieldState & {
        /** The text currently in the field. */
        value: string;
        /** How far the text is inset, so it clears whatever is drawn before and after it. */
        textInset: CSSProperties;
        /** The padding to spread over the field's parts, so the consumer sets it once rather than per part. */
        spreadPadding: CSSLogicalPadding;
        /** Receives the leading element once it exists, so the field can measure it and inset the text past it. */
        setLeadingRef: (element: HTMLElement | undefined) => void;
        /** Receives the trailing element once it exists, for the same reason. */
        setTrailingRef: (element: HTMLElement | undefined) => void;
        /** ARIA attributes for the field element, for a preset that gives the field a role of its own. */
        ariaAttributes?: TextFieldAriaAttributes;
    };

export type TextFieldElementSlots = InteractionControlSlots<TextFieldFlags> & TextFieldAdornmentSlots;

export type TextFieldProps = Omit<InteractionWrapperProps<TextFieldFlags>, "extraFlags" | "minWidth" | "minHeight"> &
    TextFieldCbs &
    Pick<InteractionControlProps<TextFieldFlags>, "id"> &
    TextFieldState &
    BaseTextFieldLayoutValues & {
        /** The text in the field. It is the only thing that changes it. */
        "value": string;
        /** Receives what the reader types, which is what `v-model:value` binds. */
        "onUpdate:value"?: (value: string) => void;
        /**
         * ARIA attributes for the field element, for a preset that gives the field a role of its own, such as a
         * combobox. They are written after the field's own, so a role here replaces the one the field would have.
         */
        "ariaAttributes"?: TextFieldAriaAttributes;
    };

export type TextFieldSlots = Pick<InteractionWrapperSlots<TextFieldFlags>, "renderDecoration"> & TextFieldElementSlots;

export type TextFieldPresetProps = Omit<
    TextFieldProps,
    | "element"
    | "isSpinButton"
    | "computeSpinValue"
    | "isAutoSizing"
    | "minRows"
    | "maxRows"
    | "isConcealed"
    | "isLeftToRight"
    | "onKeyDown"
    | "onBlur"
    | "ariaAttributes"
>;
