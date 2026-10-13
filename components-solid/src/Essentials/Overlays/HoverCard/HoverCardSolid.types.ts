import type { JSX } from "solid-js";

import type { AnchorPlacement, BaseHoverCardValues } from "@thewaver/ss-components";

import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type HoverCardProps = AccessorValues<BaseHoverCardValues> &
    AccessorProps<{
        /**
         * The element the card is anchored to and watches. Resting the pointer on it opens the card, and so
         * does a keyboard focus. Where the pointer cannot hover, a press on it opens and closes the card
         * instead, so it should be something whose press does nothing else, such as a button; a link's press
         * would also follow the link. Nothing is written onto it: the card is not its description.
         */
        anchorRef: HTMLElement | undefined;
        /**
         * Whether the card is open, for a consumer that wants to read it or open and close it from elsewhere.
         * Leave it out and the card keeps its own. The card writes `false` whenever it closes itself: when both
         * the pointer and focus have left it and its anchor, on a press outside, and on Escape, which also
         * puts focus back on the anchor when it was inside the card.
         */
        visibility?: SignalSource<boolean>;
        /**
         * Draws the card body. The fade is handed in rather than applied, so the consumer decides what fading
         * looks like; the placement comes with it for a caller that wants to point an arrow at the anchor. The
         * content may hold controls and links, which is what separates a card from a tooltip.
         */
        renderContent: (
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
            getPlacement: () => AnchorPlacement,
        ) => JSX.Element;
    }>;
