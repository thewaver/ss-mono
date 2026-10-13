import type { JSX } from "solid-js";

import type { BaseRevealCbs, BaseRevealValues } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type RevealProps = AccessorValues<BaseRevealValues> &
    BaseRevealCbs & {
        /** Draws what is underneath, waiting to be revealed. */
        renderContent: () => JSX.Element;
        /**
         * Draws the covering. It is handed whether the window is open — the pointer inside the element, or the
         * keyboard moving it — and the mask the window cuts into it.
         */
        renderCover: (getIsRevealing: () => boolean, getMaskStyle: () => JSX.CSSProperties) => JSX.Element;
    };
