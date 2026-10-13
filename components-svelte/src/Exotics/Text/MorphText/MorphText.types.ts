import type { Snippet } from "svelte";

import type { BaseMorphTextProps } from "@thewaver/ss-components";

export type MorphTextProps = BaseMorphTextProps & {
    /**
     * Draws one copy of the text, which is called for the incoming text and, while a morph runs, for the outgoing one
     * beside it. A filter on the component's own box makes the blurred copies fuse, so plain text and `PaintedText`
     * both work, paint included. Leave it out for the text as it is.
     */
    renderText?: Snippet<[text: string]>;
};
