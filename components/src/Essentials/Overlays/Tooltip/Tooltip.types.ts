import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";

export type BaseTooltipValues = {
    /**
     * Where the tooltip sits against its anchor, as one choice across and one down. A placement that will not fit
     * falls back within its own family, so a tooltip asked to sit above may end up below but never beside.
     */
    placement: AnchorPlacement;
    /**
     * How far the tooltip is held clear of its anchor, in pixels. The strip this opens is bridged, so the pointer
     * can cross it to reach the tooltip without losing it.
     */
    offset?: Point2d;
    /** Screen room to stay out of, for a consumer with a fixed header or sidebar the tooltip must not slide under. */
    reservedScreenSize?: Size2d;
    /** How long the tooltip takes to fade in and out. */
    transitionDurationMs?: number;
    /**
     * How long a keyboard focus has to rest on the anchor before the tooltip appears, so tabbing through a row of
     * controls does not flash a tooltip per stop.
     */
    focusShowDelayMs?: number;
    /**
     * How long the pointer has to rest on the anchor before the tooltip appears, so sweeping across a row of
     * controls does not flash a tooltip per control. Leaving before then shows nothing. Set it to `0` to show on
     * hover at once.
     */
    hoverShowDelayMs?: number;
    /**
     * How soon after any tooltip on the page has closed a hover or a keyboard focus opens this one at once,
     * without waiting out `hoverShowDelayMs` or `focusShowDelayMs`. Every tooltip shares one record of when the
     * last one closed, so once a reader has waited for one tooltip, moving to its neighbor — by pointer or by
     * keyboard — shows the next straight away. Only opening waits.
     */
    skipDelayWindowMs?: number;
};

export type BaseTooltipProps = BaseTooltipValues;
