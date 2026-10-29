import type { CSSAnimationValues, Size2d } from "@thewaver/ss-utils";

import type { SliceAnimationRenderer } from "../../../Abstracts/SliceAnimation/SliceAnimation.types";
import type { SVGColorMixing } from "../../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.types";
import type { SliceAnimationFn } from "../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";

export type RGBAnimationChannel = "red" | "green" | "blue";

export type RGBAnimationEvaluationResult = CSSAnimationValues;

export type RGBAnimationEvaluationDefs = {
    channel: RGBAnimationChannel;
    size: Size2d;
};

export type BaseRGBAnimationValues = {
    /** The picture whose channels are animated. */
    src: string;
    /** Names the picture for assistive technology. */
    ariaLabel?: string;
    /** Which side the animation takes as given, working the other out from the picture's proportions. */
    sizeAnchor?: "width" | "height";
    /**
     * How the three channels are put back together, which decides the color of the fringes where they drift apart.
     *
     * `"additive"` mixes them as light, so the fringes are red, green and blue and read on a dark ground.
     * `"subtractive"` mixes them as ink, so the fringes are cyan, magenta and yellow and read on a light one. The
     * channels cannot see what is behind the picture, so the wrong one shows as dark smudges on a light ground or pale
     * glows on a dark one. Left out, it follows the animation's `color-scheme`, read again at the start of each pass:
     * `dark` is additive, `light` is subtractive, both together follow the system setting, and a page that sets none is
     * treated as light. Pass it wherever the picture sits on a ground of its own, such as a dark card on a light page.
     */
    colorMixing?: SVGColorMixing;
    /** How long one pass takes, in milliseconds. */
    animationDurationMs?: number;
    /** How many passes to run. Left out, it never stops. Once they are done, each channel stays as last drawn. */
    animationIterationCount?: number;
    /** How long the picture waits between one pass and the next, in milliseconds. */
    animationIterationDelayMs?: number;
    /**
     * What draws the channels. `"graphics_card"` draws them into one canvas and falls back to page elements by itself
     * wherever it cannot: no WebGL 2, a sample written by hand rather than built by `SliceAnimationKeyframeUtils`, a
     * picture whose server gives no cross-origin permission, or a moment the browser has taken the graphics card away.
     * `"elements"` always draws each channel as an element of its own, which keeps an animated picture playing — the
     * graphics card draws only its first frame.
     */
    renderer?: SliceAnimationRenderer;
};

export type BaseRGBAnimationCbs = {
    /** What the picture as a whole does over the pass, for an effect that is not per channel. */
    computeRootAnimation?: (timeline: number) => RGBAnimationEvaluationResult;
    /**
     * The sample each channel plays over the whole pass, from `0` to `1`, handed the channel as one slice of a single
     * row — red, green, blue — with the picture's size. `RGBAnimationKeyframes` holds ready ones.
     *
     * Each channel is a full-size copy of the picture holding only that channel, so moving, turning, scaling or fading
     * one pulls it away from the other two and leaves fringes along every edge; where all three still overlap, the
     * picture's own colors come back. A sample built by `SliceAnimationKeyframeUtils` can be drawn on the graphics card;
     * one written by hand plays on page elements.
     */
    computeSliceAnimation: SliceAnimationFn;
    /** Runs at the end of each pass. */
    onIterationEnd?: () => void;
    /** Runs once every pass is done. */
    onAnimationEnd?: () => void;
};

export type BaseRGBAnimationProps = BaseRGBAnimationValues & BaseRGBAnimationCbs;
