import type { JSX } from "solid-js";

import type { BaseRichTextCbs, BaseRichTextValues } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type RichTextProps = AccessorValues<BaseRichTextValues> &
    BaseRichTextCbs & {
        /**
         * Draws a tag as an element of the consumer's own, such as a link or a component wrapping its words.
         * Handed the tag's name, a function that renders what the tag encloses, and the attributes it carried
         * that `allowedAttributes` let through. Calling `renderChildren` is what keeps nesting working: the
         * enclosed tags go through this same function and the class map in turn. Return `undefined` to leave
         * the tag to the class map, and `null` to draw nothing.
         */
        renderTag?: (
            tag: string,
            renderChildren: () => JSX.Element,
            attributes: Record<string, string>,
        ) => JSX.Element | undefined;
    };

export type RichTextRenderDefs = {
    classMap: Record<string, string>;
    removeUnknownTags: boolean;
    renderTag: RichTextProps["renderTag"];
};
