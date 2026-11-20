import type { JSX } from "solid-js";

import type { BaseRevealCbs, BaseRevealValues } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type RevealProps = AccessorValues<BaseRevealValues> &
    BaseRevealCbs & {
        /**
         * Draws what is underneath, waiting to be revealed. The cover never goes, so this content can never be
         * operated: it is out of the tab order, out of reach of the pointer and hidden from screen readers. Put
         * nothing here a person needs to press or read aloud.
         */
        renderContent: () => JSX.Element;
        /**
         * Draws the covering. It is handed whether the window is open — the pointer inside the element, or the
         * keyboard moving it — and the mask the window cuts into it.
         */
        renderCover: (getIsRevealing: () => boolean, getMaskStyle: () => JSX.CSSProperties) => JSX.Element;
    };
