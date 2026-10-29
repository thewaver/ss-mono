import { MathUtils, type Size2d } from "@thewaver/ss-utils";

import type { SVGColorMixing } from "../../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.types";
import { SVGFilterDefsUtils } from "../../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.utils";
import type { CellAnimationEvaluationDefs } from "../CellAnimation/CellAnimation.types";
import { CellAnimationUtils } from "../CellAnimation/CellAnimation.utils";
import { RGB_ANIMATION_CHANNELS } from "./RGBAnimation.const";
import type {
    RGBAnimationChannel,
    RGBAnimationEvaluationDefs,
    RGBAnimationEvaluationResult,
} from "./RGBAnimation.types";

const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const sliceDefs = new WeakMap<
    RGBAnimationEvaluationDefs,
    CellAnimationEvaluationDefs & { origin: { row: number; col: number } }
>();

/**
 * The arithmetic behind `RGBAnimation`: which mixing to use, how each channel's copy keeps only its channel, and
 * drawing a frame.
 *
 * A framework's view runs the passes on `CellAnimationUtils.runPasses`, stacks one copy of the picture per channel,
 * filters each down to its channel with {@link computeChannelMatrix}, blends them with {@link getBlendMode}, and
 * draws each frame with {@link drawFrame}.
 */
export namespace RGBAnimationUtils {
    /**
     * How the channels should be mixed for a `color-scheme` value, when the consumer has not said.
     *
     * Additive fringes read on a dark ground and subtractive ones on a light ground, and `color-scheme` is where a page
     * says which it is. `dark` alone is additive and `light` alone subtractive. Both together mean the page follows the
     * system setting, so that decides. Neither — `normal`, the value a page that sets nothing has — is subtractive,
     * since the browser then draws its default light colors. `only` and any other word are ignored.
     *
     * @param colorScheme A computed `color-scheme` value.
     * @param isSystemDark Whether the system asks for dark colors.
     */
    export const resolveColorMixing = (colorScheme: string, isSystemDark: boolean): SVGColorMixing => {
        const words = colorScheme.split(/\s+/);
        const isDark = words.includes("dark");
        const isLight = words.includes("light");

        if (isDark && isLight) return isSystemDark ? "additive" : "subtractive";

        return isDark ? "additive" : "subtractive";
    };

    /**
     * The mixing an element's `color-scheme` asks for, read now.
     *
     * Nothing announces a change to `color-scheme`, so a caller reads it again whenever it is worth catching a theme
     * switched since — `RGBAnimation` does so at the start of each pass.
     *
     * @param element The element whose `color-scheme` is read. Left out, the mixing is subtractive.
     */
    export const readColorMixing = (element: HTMLElement | undefined) =>
        element
            ? resolveColorMixing(getComputedStyle(element).colorScheme, matchMedia(DARK_SCHEME_QUERY).matches)
            : resolveColorMixing("", false);

    /**
     * The color matrix that keeps one channel of a copy, filling the other two so the three copies blend back into the
     * picture.
     *
     * @param channel Which channel the copy keeps.
     * @param colorMixing How the copies are blended back together.
     * @returns An `feColorMatrix` `values` string.
     */
    export const computeChannelMatrix = (channel: RGBAnimationChannel, colorMixing: SVGColorMixing) =>
        SVGFilterDefsUtils.computeRGBSplitMatrix(RGB_ANIMATION_CHANNELS.indexOf(channel), colorMixing);

    /**
     * The `mix-blend-mode` that puts the copies back together: `screen` for additive, `multiply` for subtractive.
     *
     * @param colorMixing How the copies are blended back together.
     */
    export const getBlendMode = (colorMixing: SVGColorMixing) => SVGFilterDefsUtils.getRGBSplitBlendMode(colorMixing);

    /**
     * What each channel's animation is handed, in the order of `RGB_ANIMATION_CHANNELS`.
     *
     * @param size The picture's size.
     */
    export const computeEvaluationDefs = (size: Size2d): RGBAnimationEvaluationDefs[] =>
        RGB_ANIMATION_CHANNELS.map((channel) => ({ channel, size }));

    /**
     * A channel's defs in the shape a cell animation is handed, so the keyframe samples and builders play on a channel.
     *
     * The channel becomes one cell of a single row, in the order of `RGB_ANIMATION_CHANNELS`, with no weight and the
     * origin at the first. The same defs give back the same object, so a builder that caches by cell stays cached.
     *
     * @param defs The channel's defs, as the component hands them over.
     */
    export const toSliceDefs = (defs: RGBAnimationEvaluationDefs) => {
        const cached = sliceDefs.get(defs);

        if (cached) return cached;

        const slice = {
            pos: { row: 0, col: RGB_ANIMATION_CHANNELS.indexOf(defs.channel) },
            count: { row: 1, col: RGB_ANIMATION_CHANNELS.length },
            weight: 0,
            size: defs.size,
            origin: { row: 0, col: 0 },
        };

        sliceDefs.set(defs, slice);

        return slice;
    };

    /**
     * Draws one frame: the whole picture's animation on the root, then each channel's on its copy.
     *
     * @param root The animation's root element.
     * @param channels The copies' elements, in the order of `defs`. A shorter list draws only as many.
     * @param defs What each channel's animation is handed, from {@link computeEvaluationDefs}.
     * @param progress How far through the pass, kept between `0` and `1` before it is handed on.
     * @param computeRootAnimation The whole picture's animation, if any.
     * @param computeSliceAnimation Each channel's animation.
     */
    export const drawFrame = (
        root: HTMLElement,
        channels: HTMLElement[],
        defs: RGBAnimationEvaluationDefs[],
        progress: number,
        computeRootAnimation: ((timeline: number) => RGBAnimationEvaluationResult) | undefined,
        computeSliceAnimation: (defs: RGBAnimationEvaluationDefs, timeline: number) => RGBAnimationEvaluationResult,
    ) => {
        const t = MathUtils.clamp01(progress);

        if (computeRootAnimation) CellAnimationUtils.assignAnimationProps(root, computeRootAnimation(t));

        for (let i = 0; i < channels.length && i < defs.length; i++) {
            CellAnimationUtils.assignAnimationProps(channels[i], computeSliceAnimation(defs[i], t));
        }
    };
}
