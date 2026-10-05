import type { PointSource, ProximityTextDistanceAxis } from "@thewaver/ss-components";

import type { AccessorProps } from "../../../Utils/typeUtils";

export type ProximityTextProps = AccessorProps<{
    /**
     * Names the keyframes one letter plays, from the letter itself, where it falls among all of them from `0`, and
     * how many there are. Each letter is held between the first frame, far from the point, and the last, under it, so
     * the keyframes can move any property — a variable font's weight or width, a color, a letter spacing. **The widest
     * frame has to be the first or the last**: the text is wrapped for every letter at whichever of the two is wider,
     * so a frame wider partway through can push a line past the box. An image or other whole element is passed as `"￼"` and a line break
     * the text holds as `"\n"`. Left out, the letters thicken.
     */
    computeAnimationName?: (character: string, index: number, count: number) => string;
    /**
     * How far from a letter's middle the point still reaches it, in pixels. A letter under the point is at its last
     * frame, and the hold falls with the square of the distance to the first frame at this reach.
     */
    reachPx?: number;
    /**
     * The point to follow instead of the pointer.
     *
     * A fraction across a box — the text's own, or the element named in the source — so a point moving across a
     * banner can sweep a wave of weight through every line under it. While the source has no point every letter
     * rests, as it does when the pointer leaves the window. Left out, the pointer is followed.
     */
    pointSource?: PointSource;
    /**
     * Which way nearness is measured. `"both"`, the default, measures straight to the point. `"vertical"` counts only
     * how far above or below the point a letter sits, so the point acts as a line across the text and every letter
     * on one line answers it alike — a band of text near the bottom of a scrolling box can swell as one line at a
     * time. `"horizontal"` counts only how far across, a line down the text.
     */
    distanceAxis?: ProximityTextDistanceAxis;
    /**
     * Rests every letter at its first frame and stops following the point. It is what a consumer honoring a
     * reduced-motion preference passes, since the library never reads that preference itself.
     */
    isDisabled?: boolean;
}>;
