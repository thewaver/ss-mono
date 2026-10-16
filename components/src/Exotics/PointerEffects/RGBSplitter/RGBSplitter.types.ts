import type { PointSource } from "../../../Abstracts/PointerTracker/PointerTracker.types";
import type { SVGColorMixing } from "../../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.types";

export type BaseRGBSplitterValues = {
    /**
     * How near the pointer has to be before the content answers it at all, in pixels from its center.
     *
     * Left out, it answers a pointer anywhere on the page. Set, the content sits whole until the pointer comes
     * inside the range, which is what stops a page full of these from all splitting at once as the pointer crosses
     * it.
     */
    activeRangePx?: number;
    /**
     * How far from the content's center the split reaches, in pixels.
     *
     * The split is at its widest with the pointer on the center and closes as the pointer walks out to this
     * distance. It is measured from the center rather than from the edge, so even on the content the split keeps
     * growing as the pointer heads for the middle.
     */
    splitRangePx?: number;
    /**
     * The furthest any one channel is shifted, in pixels, reached with the pointer on the center.
     *
     * Red, green and blue are each given a random direction and distance within this, kept for as long as the split
     * shows and drawn again the next time it opens, so no two approaches pull the content apart the same way. `0`
     * turns the split off.
     */
    maxOffsetPx?: number;
    /**
     * How the three channels are put back together, which decides the color of the fringes.
     *
     * `"additive"` mixes them as light, so the fringes are red, green and blue and read on a dark ground.
     * `"subtractive"` mixes them as ink, so the fringes are cyan, magenta and yellow and read on a light one. A filter
     * cannot see what is behind the content, so the wrong one shows as dark smudges on a light ground or pale glows
     * on a dark one. Left out, it follows the content's `color-scheme`, read again each time the split opens: `dark`
     * is additive, `light` is subtractive, both together follow the system setting, and a page that sets none is
     * treated as light. Pass it wherever the content sits on a ground of its own, such as a dark card on a light page.
     */
    colorMixing?: SVGColorMixing;
    /**
     * How long the split takes to catch up with the pointer, in milliseconds. `0`, the default, follows it
     * exactly.
     *
     * Each channel's shift eases towards where the pointer says it should be, closing about two-thirds of the gap
     * in this time, however fast or slow the screen draws — so the channels glide apart and back together rather
     * than jumping, including onto the new directions drawn when the pointer comes back while they are still
     * closing.
     */
    smoothingMs?: number;
    /**
     * Stops the content answering the pointer, leaving it whole.
     *
     * It is what a consumer honoring a reduced-motion preference passes, since the library never reads that
     * preference itself — only the consumer knows whether the split is motion worth suppressing.
     */
    isDisabled?: boolean;
    /**
     * The point to follow instead of the pointer.
     *
     * A fraction across a box — this component's own, or the element named in the source — so one moving point can
     * be handed to several of these and each answers to the same spot. While the source has no point the component
     * rests, as it does when the pointer leaves the window. Left out, the pointer is followed.
     */
    pointSource?: PointSource;
};

export type BaseRGBSplitterProps = BaseRGBSplitterValues;
