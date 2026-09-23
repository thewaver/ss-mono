import type { JSX } from "solid-js";

import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";
import type { ModalNameProps } from "../Modal/Modal.types";

export type HoverCardProps = ModalNameProps &
    AccessorProps<{
        /**
         * Where the card sits against its anchor, as one choice across and one down. A placement that will not
         * fit falls back within its own family.
         */
        placement?: AnchorPlacement;
        /**
         * How far the card is held clear of its anchor, in pixels. The strip this opens is bridged, so the
         * pointer can cross it to reach the card without losing it.
         */
        offset?: Point2d;
        /** Screen room to stay out of, for a consumer with a fixed header or sidebar the card must not slide under. */
        reservedScreenSize?: Size2d;
        /** How long the card takes to fade in and out. */
        transitionDurationMs?: number;
        /**
         * How long a keyboard focus has to rest on the anchor before the card opens, so tabbing through a row of
         * anchors does not open a card per stop. Once it is open, Tab moves focus from the anchor into the card.
         */
        focusShowDelayMs?: number;
        /**
         * How long the pointer has to rest on the anchor before the card opens, so sweeping across a row of
         * anchors does not open a card per anchor. Leaving before then opens nothing. Set it to `0` to open on
         * hover at once.
         */
        hoverShowDelayMs?: number;
        /**
         * How soon after any hover card on the page has closed a hover opens this one at once, without waiting
         * out `hoverShowDelayMs`. Hover cards share this record with each other and not with tooltips. Focus
         * always waits `focusShowDelayMs`.
         */
        skipDelayWindowMs?: number;
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
        visibilitySignal?: SignalSource<boolean>;
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
