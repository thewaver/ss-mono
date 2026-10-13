import type { JSX } from "solid-js";

import type { BaseLensCbs, BaseLensValues } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type LensProps = AccessorValues<BaseLensValues> &
    BaseLensCbs & {
        /**
         * Draws the content. It is called twice: once for the content itself, and once for the copy magnified inside the
         * lens, which is laid out in a box of the element's own size before it is scaled.
         *
         * Only the first is real to a screen reader and to Tab; the copy is hidden from both and takes no pointer
         * events. Anything with a state of its own — a playing video, a half-filled field — runs separately in the
         * copy, so the lens shows whatever the copy was drawn with rather than what the content is doing. Content with
         * no background of its own lets the content underneath show through the lens beside the copy.
         */
        renderContent: () => JSX.Element;
    };
