import type { VNodeChild } from "vue";

import type { TilterState } from "@thewaver/ss-components";

export type TilterProps = {
    /**
     * How near the pointer has to be before the surface answers it at all, in pixels from the area's center.
     *
     * Left out, it answers a pointer anywhere on the page. Set, the surface lies flat until the pointer comes
     * inside the range and lies flat again once it leaves, which is what stops a wall of these from all
     * leaning at once as the pointer crosses the page.
     */
    activeRangePx?: number;
    /**
     * How far from the surface's center the pointer starts to tip it, in pixels.
     *
     * The turn is at its strongest with the pointer on the surface's own edge and fades to nothing as the
     * pointer walks out to this distance, so a pointer crossing the far side of the page leaves it flat. The
     * fade runs from the edge rather than from the center, so a wide thing and a narrow one both reach full
     * strength where they are actually touched.
     *
     * Inside the surface the turn falls away again towards the middle, which is the other half of the curve —
     * a card being pointed at dead center is a card being looked at straight on, and it lies flat.
     */
    tiltRangePx?: number;
    /** How far the surface turns at the very edge of the tilted area. */
    maxTiltDegrees?: number;
    /**
     * How near the viewer sits, in pixels. Smaller is a more violent perspective; larger flattens the turn
     * towards a plain rotation.
     */
    perspectivePx?: number;
    /**
     * How long the surface takes to catch up with the pointer, in milliseconds. `0`, the default, follows it
     * exactly.
     *
     * The turn, the sheen and `strength` ease towards where the pointer says they should be, closing about
     * two-thirds of the gap in this time, however fast or slow the screen draws — so the surface lags a quick
     * movement and settles softly, and it glides back flat rather than snapping when the pointer leaves.
     * `boxRatio` is not eased: it is where the pointer actually is.
     */
    smoothingMs?: number;
    /**
     * Stops the surface following the pointer, leaving it flat.
     *
     * It is what a consumer honoring a reduced-motion preference passes, since the library never reads that
     * preference itself — only the consumer knows whether a turning surface is motion worth suppressing.
     */
    isDisabled?: boolean;
};

export type TilterSlots = {
    /**
     * Draws the specular layer over the content, and is told where the band should sit.
     *
     * It is a slot rather than something drawn here because the sheen has to take the shape of whatever is
     * underneath it — a card with rounded corners wants a rounded sheen, and a wrapper cannot know the
     * corners its child was given. Left out, the surface turns with nothing on it.
     */
    renderSheen: (state: TilterState) => VNodeChild;
    /** The content that turns with the surface. */
    default?: () => VNodeChild;
};
