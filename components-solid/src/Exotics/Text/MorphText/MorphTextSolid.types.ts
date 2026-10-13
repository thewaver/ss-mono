import type { Accessor, JSX } from "solid-js";

import type { BaseMorphTextCbs, BaseMorphTextValues } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type MorphTextProps = AccessorValues<BaseMorphTextValues> &
    BaseMorphTextCbs & {
        /**
         * Draws one copy of the text, which is called for the incoming text and, while a morph runs, for the outgoing one
         * beside it. A filter on the component's own box makes the blurred copies fuse, so plain text and `PaintedText`
         * both work, paint included. Leave it out for the text as it is.
         */
        renderText?: (getText: Accessor<string>) => JSX.Element;
    };
