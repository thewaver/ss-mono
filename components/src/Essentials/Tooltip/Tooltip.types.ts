import type { JSX } from "solid-js";

import { Point2d, Size2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type TooltipProps = AccessorProps<{
    /**
     * Where the tooltip sits against its anchor, as one choice across and one down. A placement that will
     * not fit falls back within its own family, so a tooltip asked to sit above may end up below but never
     * beside.
     */
    placement: AnchorPlacement;
    /**
     * How far the tooltip is held clear of its anchor, in pixels. The strip this opens is bridged, so the
     * pointer can cross it to reach the tooltip without losing it.
     */
    offset?: Point2d;
    /**
     * Screen room to stay out of, for a consumer with a fixed header or sidebar the tooltip must not slide
     * under.
     */
    reservedScreenSize?: Size2d;
    /** How long the tooltip takes to fade in and out. */
    transitionDurationMs?: number;
    /**
     * How long a keyboard focus has to rest on the anchor before the tooltip appears. Hovering shows it at
     * once; only focus waits, so tabbing through a row of controls does not flash a tooltip per stop.
     */
    focusShowDelayMs?: number;
    /**
     * The element the tooltip is anchored to and watches. It is also what gets `aria-describedby` while the
     * tooltip is up, which is how the tooltip is announced at all.
     */
    anchorRef: HTMLElement | undefined;
    /**
     * Draws the tooltip body. The fade is handed in rather than applied, so the consumer decides what
     * fading looks like; the placement comes with it for a caller that wants to point an arrow at the
     * anchor.
     */
    renderContent: (
        getVisibilityTarget: () => 0 | 1,
        getTransitionDurationMs: () => number,
        getPlacement: () => AnchorPlacement,
    ) => JSX.Element;
}>;
