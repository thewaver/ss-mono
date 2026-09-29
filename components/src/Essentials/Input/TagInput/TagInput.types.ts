export type TagInputFlags = {
    isEmpty: boolean;
    hasTags: boolean;
};

export type TagInputKeyAction =
    | { kind: "add" }
    | { kind: "remove"; index: number }
    | { kind: "focusTag"; index: number }
    | { kind: "focusField"; isTyping: boolean };

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
    onMouseEnter?: (e: MouseEvent) => void;
    /** Runs when the pointer leaves the field. */
    onMouseLeave?: (e: MouseEvent) => void;
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
