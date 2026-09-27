import type { KeyboardEvent, MouseEvent, ReactNode, RefObject } from "react";

import type { InteractionFlags, TagInputFlags, TagInputState } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { TextFieldTextStyle } from "../../../Primitives/TextField/TextField.types";

export type TagInputCbs = {
    /**
     * Turns what was typed into a tag, or refuses it by answering with nothing — which is where trimming, lower-casing
     * and rejecting duplicates live.
     */
    computeTag?: (text: string) => string | undefined;
    /** Names one tag for assistive technology, so a reader hears what removing it would do. */
    computeTagAriaLabel?: (tag: string) => string;
    /** Runs when a tag is added or removed. */
    onTagsChange?: (tags: string[]) => void;
    /** Runs when the pointer arrives over the field. */
    onMouseEnter?: (e: MouseEvent<HTMLDivElement>) => void;
    /** Runs when the pointer leaves the field. */
    onMouseLeave?: (e: MouseEvent<HTMLDivElement>) => void;
};

export type TagInputProps = Omit<InteractionWrapperProps<TagInputFlags>, "renderControl" | "extraFlags" | "role"> &
    TagInputCbs &
    Pick<InteractionControlProps<TagInputFlags>, "id" | "renderContent"> &
    TagInputState & {
        /** The tags, and how to change them. It is the only thing that adds or removes one. */
        valueState: readonly [string[], (tags: string[]) => void];
        /** What is currently typed but not yet turned into a tag, and how to change it. */
        textState?: readonly [string, (text: string) => void];
        /** Styles the field's text against its current state. */
        computeTextStyle?: (flags: InteractionFlags<TagInputFlags>) => TextFieldTextStyle;
        /** Draws one tag. */
        renderTag: (tag: string, flags: InteractionFlags) => ReactNode;
        /** Draws the placeholder shown while the field is empty. */
        renderPlaceholder?: (flags: InteractionFlags<TagInputFlags>) => ReactNode;
    };

export type TagInputFieldElementProps = {
    /** Receives the text field once it exists, so the wrapper around it can follow its focus and hover. */
    ref: (element: HTMLElement | null) => void;
    /** Holds the text field for the tag field itself, which moves focus into it. */
    fieldRef: RefObject<HTMLInputElement | null>;
    /** Put on the text field, so an id is enough to reach it from a label or a test. */
    id?: string;
    /** The field's name when it is submitted as part of a form. */
    name?: string;
    /** The text's style, from the consumer's `computeTextStyle`. */
    style?: TextFieldTextStyle;
    /** What is typed but not yet a tag. */
    value: string;
    /** Whether the field refuses input. */
    isDisabled: boolean;
    /** The field's accessible name, already resolved against any surrounding label. */
    ariaLabel?: string;
    /** The ids describing the field, already combined with any surrounding form field's. */
    ariaDescribedBy?: string;
    /** Runs with the new text as it is typed. */
    onChange: (text: string) => void;
    /** Runs on a key pressed in the field. */
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
};
