import type { Accessor, JSX } from "solid-js";

import type { Point2d } from "@thewaver/ss-utils";

import type { AccessorProps } from "../../../Utils/typeUtils";

export type TilterState = {
    /** How far the surface is turned, in degrees: `x` about the horizontal axis, `y` about the upright one. */
    tilt: Point2d;
    /** Where the pointer is across the tilted area, `0` to `1` on each axis. */
    boxRatio: Point2d;
    /**
     * Where the specular band sits across the surface, `0` to `100`, for a painter drawing one as a gradient
     * stop. It runs the opposite way to the pointer, which is what makes the surface read as reflecting
     * something rather than as being painted on.
     */
    sheenPosition: number;
    /**
     * How strongly the surface is answering the pointer, `0` to `1`.
     *
     * It is `1` while the pointer is on the surface and falls to `0` as the pointer walks out to
     * `tiltRangePx`, so a painter multiplying by it fades in step with the turn instead of staying at full
     * strength and then vanishing. Everything else in this state has already been scaled by it.
     */
    strength: number;
    /** Whether the surface is lying flat, either because nothing is pointing at it or because it is off. */
    isResting: boolean;
};

export type TilterProps = AccessorProps<{
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
     * Stops the surface following the pointer, leaving it flat.
     *
     * It is what a consumer honoring a reduced-motion preference passes, since the library never reads that
     * preference itself — only the consumer knows whether a turning surface is motion worth suppressing.
     */
    isDisabled?: boolean;
}> & {
    /**
     * Draws the specular layer over the content, and is told where the band should sit.
     *
     * It is a slot rather than something drawn here because the sheen has to take the shape of whatever is
     * underneath it — a card with rounded corners wants a rounded sheen, and a wrapper cannot know the
     * corners its child was given. Left out, the surface turns with nothing on it.
     */
    renderSheen?: (getState: Accessor<TilterState>) => JSX.Element;
};
