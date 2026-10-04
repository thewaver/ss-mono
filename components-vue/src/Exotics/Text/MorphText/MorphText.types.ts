import type { VNodeChild } from "vue";

export type MorphTextProps = {
    /**
     * The text to show. Changing it melts the old text into the new one; cycling through words is the consumer's
     * timer.
     */
    text: string;
    /**
     * How long one morph takes. `0` swaps the text at once, which is the way to honor a request for reduced motion.
     * A change part-way through a morph starts again from the text that was arriving.
     */
    morphDurationMs?: number;
    /** The most either copy is blurred while they cross, in pixels. More blur melts more of the shapes together. */
    maxBlurPx?: number;
    /** Runs once a morph has finished, with the text it arrived at. */
    onMorphEnd?: (text: string) => void;
};

export type MorphTextSlots = {
    /**
     * Draws one copy of the text, which is called for the incoming text and, while a morph runs, for the outgoing one
     * beside it. A filter on the component's own box makes the blurred copies fuse, so plain text and `PaintedText`
     * both work, paint included. Leave it out for the text as it is.
     */
    renderText?: (text: string) => VNodeChild;
};
