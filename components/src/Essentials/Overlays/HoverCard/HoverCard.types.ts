import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { ModalNameProps } from "../Modal/Modal.types";

/** How a card answers a dismissal: closing and putting focus back on its anchor, closing, or staying open. */
export type HoverCardDismissal = "restore" | "close" | "ignore";

export type BaseHoverCardValues = ModalNameProps & {
    /**
     * Where the card sits against its anchor, as one choice across and one down. A placement that will not fit falls
     * back within its own family.
     */
    placement?: AnchorPlacement;
    /**
     * How far the card is held clear of its anchor, in pixels. The strip this opens is bridged, so the pointer can
     * cross it to reach the card without losing it.
     */
    offset?: Point2d;
    /** Screen room to stay out of, for a consumer with a fixed header or sidebar the card must not slide under. */
    reservedScreenSize?: Size2d;
    /** How long the card takes to fade in and out. */
    transitionDurationMs?: number;
    /**
     * How long a keyboard focus has to rest on the anchor before the card opens, so tabbing through a row of anchors
     * does not open a card per stop. Once it is open, Tab moves focus from the anchor into the card.
     */
    focusShowDelayMs?: number;
    /**
     * How long the pointer has to rest on the anchor before the card opens, so sweeping across a row of anchors does
     * not open a card per anchor. Leaving before then opens nothing. Set it to `0` to open on hover at once.
     */
    hoverShowDelayMs?: number;
    /**
     * How soon after any hover card on the page has closed a hover or a keyboard focus opens this one at once,
     * without waiting out `hoverShowDelayMs` or `focusShowDelayMs`. Hover cards share this record with each other
     * and not with tooltips.
     */
    skipDelayWindowMs?: number;
};

export type BaseHoverCardProps = BaseHoverCardValues;
