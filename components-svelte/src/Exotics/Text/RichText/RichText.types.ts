import type { Snippet } from "svelte";

import type { BaseRichTextProps } from "@thewaver/ss-components";

export type RichTextProps = BaseRichTextProps & {
    /**
     * Draws a tag as an element of the consumer's own, such as a link or a component wrapping its words.
     * Handed the tag's name, a snippet that renders what the tag encloses, the attributes it carried that
     * `allowedAttributes` let through, and a snippet that draws the tag as it would be drawn without this
     * one. Rendering `renderChildren` is what keeps nesting working: the enclosed tags go through this same
     * snippet and the class map in turn. Render `renderDefault` to leave the tag to the class map, and
     * nothing to draw nothing.
     */
    renderTag?: Snippet<
        [tag: string, renderChildren: Snippet, attributes: Record<string, string>, renderDefault: Snippet]
    >;
};
