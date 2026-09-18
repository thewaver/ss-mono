import type { Accessor, JSX } from "solid-js";

import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { TextFieldTextStyle } from "../../../Primitives/TextField/TextField.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type TagInputFlags = {
    isEmpty: boolean;
    hasTags: boolean;
};

export type TagInputCbs = {
    /**
     * Turns what was typed into a tag, or refuses it by answering with nothing — which is where trimming, lower-casing
     * and rejecting duplicates live.
     */
    computeTag?: (text: string) => string | undefined;
    /** Names one tag for assistive technology, so a reader hears what removing it would do. */
    computeTagAriaLabel?: (tag: string) => string;
    /** Runs when a tag is added or removed. */
    onTagsChange?: (tags: string[]) => void | Promise<void>;
    /** Runs when the pointer arrives over the field. */
    onMouseEnter?: (e: MouseEvent) => void | Promise<void>;
    /** Runs when the pointer leaves the field. */
    onMouseLeave?: (e: MouseEvent) => void | Promise<void>;
};

export type TagInputState = {
    /** The field's name when it is submitted as part of a form. */
    name?: string;
    /** Names the field for assistive technology. */
    ariaLabel?: string;
    /** How much room is left inside the field, around the tags and the text. */
    padding?: number;
    /** The space between tags. */
    gap?: number;
};

export type TagInputProps = Omit<InteractionWrapperProps<TagInputFlags>, "renderControl" | "extraFlags" | "role"> &
    AccessorProps<
        TagInputCbs &
            Pick<InteractionControlProps<TagInputFlags>, "id" | "renderContent"> &
            TagInputState & {
                /** The tags. It is the only thing that adds or removes one. */
                valueSignal: SignalSource<string[]>;
                /** What is currently typed but not yet turned into a tag. */
                textSignal?: SignalSource<string>;
                /** Styles the field's text against its current state. */
                computeTextStyle?: (getFlags: () => InteractionFlags<TagInputFlags>) => TextFieldTextStyle;
                /** Draws one tag. */
                renderTag: (getTag: Accessor<string>, getFlags: () => InteractionFlags) => JSX.Element;
                /** Draws the placeholder shown while the field is empty. */
                renderPlaceholder?: (getFlags: () => InteractionFlags<TagInputFlags>) => JSX.Element;
            }
    >;
