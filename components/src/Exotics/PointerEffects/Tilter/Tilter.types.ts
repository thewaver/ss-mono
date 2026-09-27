import type { Point2d } from "@thewaver/ss-utils";

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
