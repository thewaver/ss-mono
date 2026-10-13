import type { VNodeChild } from "vue";

import type { BaseRichTextProps } from "@thewaver/ss-components";

export type RichTextProps = BaseRichTextProps;

export type RichTextSlots = {
    /**
     * Draws a tag as an element of the consumer's own, such as a link or a component wrapping its words.
     * Handed the tag's name, a function that renders what the tag encloses, and the attributes it carried
     * that `allowedAttributes` let through. Calling `renderChildren` is what keeps nesting working: the
     * enclosed tags go through this same function and the class map in turn. Drawing nothing — `undefined`,
     * `null`, or a template branch that renders nothing — leaves the tag to the class map; to draw nothing
     * for a tag, draw an empty fragment.
     */
    renderTag: (props: {
        tag: string;
        renderChildren: () => VNodeChild;
        attributes: Record<string, string>;
    }) => VNodeChild;
};
