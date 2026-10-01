import type { Snippet } from "svelte";

import type { RichTextAllowedAttributes } from "@thewaver/ss-components";

export type RichTextProps = {
    /** The markup to render. */
    content: string;
    /** Strips any tag that was not mapped to a class, rather than leaving it in the markup untouched. */
    removeOtherTags?: boolean;
    /**
     * Which attributes each tag may carry, as a tag name mapped to the attribute names it accepts, so
     * `{ a: ["href"] }` lets `[a href="…"]` through. An opening tag carrying an attribute not listed for it
     * is not a tag at all and prints as typed, which keeps a bracket in ordinary prose from being read as
     * markup. Names are matched case-sensitively, as tag names are. The values reach `renderTag` untouched
     * and unvetted: the library writes no attribute onto any element itself, so what a value is allowed to
     * become, a link's address included, is decided by whoever renders it.
     */
    allowedAttributes?: RichTextAllowedAttributes;
    /** Maps each tag to the classes it is drawn with, given the defaults to build on. */
    computeClassNames?: (defaultClasses: Record<string, string>) => Record<string, string>;
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
