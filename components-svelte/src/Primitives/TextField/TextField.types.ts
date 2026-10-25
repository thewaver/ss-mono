import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";
import type { AriaAttributes, AriaRole, FullAutoFill } from "svelte/elements";

import type {
    BaseTextFieldCbs,
    BaseTextFieldFieldValues,
    BaseTextFieldLayoutValues,
    InteractionFlags,
    TextFieldFlags,
    TextSyncElement,
} from "@thewaver/ss-components";
import type { CSSLogicalPadding } from "@thewaver/ss-utils";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../InteractionWrapper/InteractionWrapper.types.js";

export type TextFieldTextStyle = Partial<
    Record<
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
        | "wordSpacing",
        string
    >
>;

export type TextFieldAriaAttributes = AriaAttributes & {
    /** The role the field element takes instead of its own. */
    role?: AriaRole;
};

export type TextFieldCbs = BaseTextFieldCbs & {
    /** Runs on a key pressed while the field has focus. */
    onKeyDown?: (e: KeyboardEvent) => void;
    /** Runs when the pointer arrives over the field. */
    onMouseEnter?: (e: MouseEvent) => void;
    /** Runs when the pointer leaves the field. */
    onMouseLeave?: (e: MouseEvent) => void;
    /**
     * Styles the field's text against its current state. The keys are camelCase CSS properties and the values are
     * written as they are, so a length needs its unit.
     */
    computeTextStyle?: (flags: InteractionFlags<TextFieldFlags>) => TextFieldTextStyle;
    /** Draws the placeholder shown while the field is empty. */
    renderPlaceholder?: Snippet<[flags: InteractionFlags<TextFieldFlags>, hint: string | undefined]>;
    /** Draws whatever sits before the text, inside the field. */
    renderLeading?: Snippet<[flags: InteractionFlags<TextFieldFlags>]>;
    /** Draws whatever sits after the text, inside the field. */
    renderTrailing?: Snippet<[flags: InteractionFlags<TextFieldFlags>]>;
};

export type TextFieldState = BaseTextFieldFieldValues & {
    /** What the browser may offer to fill the field with. */
    autoComplete?: FullAutoFill;
};

export type TextFieldElementProps = TextFieldCbs &
    InteractionControlProps<TextFieldFlags> &
    TextFieldState & {
        /** The text currently in the field. */
        value: string;
        /** How far the text is inset, as a style, so it clears whatever is drawn before and after it. */
        textInset: string;
        /** The padding to spread over the field's parts, so the consumer sets it once rather than per part. */
        spreadPadding: CSSLogicalPadding;
        /** Hands the leading element over once it exists, so the field can measure it and inset the text past it. */
        attachLeading: Attachment<HTMLDivElement>;
        /** Hands the trailing element over once it exists, for the same reason. */
        attachTrailing: Attachment<HTMLDivElement>;
        /** Receives the field element once it exists, so the field can measure its content. */
        attachControl: Attachment<TextSyncElement>;
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
        /** The text in the field. Bind it with `bind:value`; it is the only thing that changes the text. */
        value: string;
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
    | "isLeftToRight"
    | "onKeyDown"
    | "onBlur"
    | "ariaAttributes"
>;
