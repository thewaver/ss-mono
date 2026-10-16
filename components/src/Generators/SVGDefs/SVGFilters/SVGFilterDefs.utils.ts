import type { Point2d } from "@thewaver/ss-utils";

import { SVG_FILTER_DEFAULTS } from "./SVGFilterDefs.const";
import type {
    SVGBrightnessFilterDefs,
    SVGColorFilterDefs,
    SVGColorMixing,
    SVGContrastFilterDefs,
    SVGDropShadowFilterDefs,
    SVGFilterAssembly,
    SVGFilterAssemblyDefs,
    SVGFilterFrame,
    SVGFilterPrimitiveKind,
    SVGFilterRegion,
    SVGGaussianBlurFilterDefs,
    SVGHueRotationFilterDefs,
    SVGInversionFilterDefs,
    SVGPixelateFilterDefs,
    SVGRGBSplitFilterDefs,
    SVGSaturationFilterDefs,
    SVGTurbulenceFilterDefs,
} from "./SVGFilterDefs.types";

const FALLBACK_FILTER_REGION: SVGFilterRegion = {
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%",
};

const SOURCE_GRAPHIC = "SourceGraphic";
const EDGE_FADE_BLUR_RATIO = 0.5;
const BLUR_REACH_SIGMAS = 3;
const RGB_CHANNEL_COUNT = 3;
const MATRIX_ROW_LENGTH = 5;
const ALPHA_ROW = "0 0 0 1 0";
const RGB_SPLIT_FILLS: Record<SVGColorMixing, number> = { additive: 0, subtractive: 1 };
const RGB_SPLIT_BLEND_MODES: Record<SVGColorMixing, "screen" | "multiply"> = {
    additive: "screen",
    subtractive: "multiply",
};

/** A color matrix scaling red, green and blue by their own factors and adding a constant to each. */
const computeChannelMatrix = (r: number, g: number, b: number, intercept: number) =>
    `${r} 0 0 0 ${intercept} 0 ${g} 0 0 ${intercept} 0 0 ${b} 0 ${intercept} 0 0 0 1 0`;

/**
 * The bookkeeping and arithmetic behind an SVG `filter` built one effect at a time: which effects are kept, what
 * each one's result is called, what each one reads, how far the region must reach, and the values the
 * color-matrix and noise primitives carry. The elements themselves are each framework's markup, written by its
 * `SVGFilterDefsFactory`.
 */
export namespace SVGFilterDefsUtils {
    /**
     * Keeps the list of effects one filter is built from.
     *
     * Each `add…` call decides whether the effect would change the picture at all, and answers `undefined` when
     * it would not, so a caller can pass settings straight through from a control without checking them first:
     * a drop shadow with neither blur nor offset, a blur whose deviation is `0` or less, a displacement whose scale
     * is `0`, a hue turn of `0`, a saturation, brightness or contrast of `1`, an inversion of `0`, channel
     * multipliers that are all `1`, an RGB split with nothing shifted and no `maxOffset` to shift by, and a specular
     * constant of `0` or less (it defaults to `1`). Diffuse lighting is always kept. A kept effect is given a result name built from the filter's id and counted per kind, so two
     * filters on one page never read each other's results, and its reach past the element's box is remembered for
     * the region: three deviations for a blur, plus the longer offset for a shadow, half the scale either way for a
     * displacement, and for an RGB split its `maxOffset`, or the longest shift on either axis when that is left out. A pixelation of one pixel or less changes nothing and is not kept.
     *
     * `computeAssembly` says how the kept effects are put together. The method decides what each effect is
     * applied to. `"isolate"`, the default, applies every effect to the original graphic and lays all the results
     * over it, so each effect is seen on its own. `"chain"` feeds each effect the previous one's result, so they
     * compound and the last one is what shows. The region is grown to fit effects that reach past the element:
     * given the element's size, by exactly that reach on every side; without it, any reach at all doubles the
     * region about the element; with no reach, the browser's default stands. A known size is written in pixels,
     * except when a pixelation is kept: then the same region is written as shares of the element's box, because
     * Safari draws nothing at all for some primitives under a region given in pixels. A pixelation needs the size,
     * so without one it is left out and the others are assembled as if it had never been added. It answers the
     * region's attributes, the region's size in pixels when the element's is known (the `frame` a pixelation draws
     * its grid to), what each effect reads in the order they were added, and — under `"isolate"` — the results to
     * merge over the original, or `undefined` when nothing was kept, since a `filter` with no primitives takes the
     * element it is applied to off the screen.
     *
     * @param filterId The id the rendered `filter` carries.
     * @returns The `add…` calls, each answering the kept effect's result name or `undefined`, and
     * `computeAssembly`, which takes the method and the element's size in pixels when it is known.
     */
    export const createRegistry = (filterId: string) => {
        const counts: Partial<Record<SVGFilterPrimitiveKind, number>> = {};
        const keys: string[] = [];
        const kinds: Record<string, SVGFilterPrimitiveKind> = {};

        let maxOffset = 0;

        const add = (kind: SVGFilterPrimitiveKind, reach = 0) => {
            const count = counts[kind] ?? 0;
            const key = `${filterId}_${kind}_${count}`;

            counts[kind] = count + 1;
            keys.push(key);
            kinds[key] = kind;
            maxOffset = Math.max(maxOffset, reach);

            return key;
        };

        return {
            addDropShadow: (defs: SVGDropShadowFilterDefs) =>
                defs.stdDeviation <= 0 && defs.dx === 0 && defs.dy === 0
                    ? undefined
                    : add(
                          "drop_shadow",
                          defs.stdDeviation * BLUR_REACH_SIGMAS + Math.max(Math.abs(defs.dx), Math.abs(defs.dy)),
                      ),
            addGaussianBlur: (defs: SVGGaussianBlurFilterDefs) =>
                defs.stdDeviation <= 0 ? undefined : add("gaussian_blur", defs.stdDeviation * BLUR_REACH_SIGMAS),
            addTurbulence: (defs: SVGTurbulenceFilterDefs) =>
                defs.scale === 0 ? undefined : add("turbulence", Math.abs(defs.scale) * 0.5),
            addHueRotation: (defs: SVGHueRotationFilterDefs) => (defs.deg === 0 ? undefined : add("hue_rotation")),
            addSaturation: (defs: SVGSaturationFilterDefs) => (defs.amount === 1 ? undefined : add("saturation")),
            addBrightness: (defs: SVGBrightnessFilterDefs) => (defs.amount === 1 ? undefined : add("brightness")),
            addContrast: (defs: SVGContrastFilterDefs) => (defs.amount === 1 ? undefined : add("contrast")),
            addInversion: (defs: SVGInversionFilterDefs) => (defs.amount === 0 ? undefined : add("inversion")),
            addColorChannel: (defs: SVGColorFilterDefs) =>
                defs.r === 1 && defs.g === 1 && defs.b === 1 ? undefined : add("color"),
            addRGBSplit: (defs: SVGRGBSplitFilterDefs) => {
                const reach =
                    defs.maxOffset ??
                    Math.max(
                        ...[defs.red, defs.green, defs.blue].map((shift) =>
                            Math.max(Math.abs(shift.x), Math.abs(shift.y)),
                        ),
                    );

                return reach <= 0 ? undefined : add("rgb_split", reach);
            },
            addPixelate: (defs: SVGPixelateFilterDefs) => (defs.size <= 1 ? undefined : add("pixelate")),
            addSpecularLighting: (specularConstant: number | undefined) =>
                (specularConstant ?? SVG_FILTER_DEFAULTS.specularConstant) <= 0 ? undefined : add("specular_lighting"),
            addDiffuseLighting: () => add("diffuse_lighting"),
            computeAssembly: (defs?: SVGFilterAssemblyDefs): SVGFilterAssembly | undefined => {
                const size = defs?.elementSize;
                const hasSize = size !== undefined && size.width > 0 && size.height > 0;
                const kept = hasSize ? keys : keys.filter((key) => kinds[key] !== "pixelate");

                if (kept.length < 1) return undefined;

                const method = defs?.method ?? SVG_FILTER_DEFAULTS.method;
                const hasPixelate = kept.some((key) => kinds[key] === "pixelate");

                const frame: SVGFilterFrame | undefined = hasSize
                    ? { width: size.width + maxOffset * 2, height: size.height + maxOffset * 2, offset: maxOffset }
                    : undefined;

                const region: SVGFilterRegion | undefined =
                    frame && size && hasPixelate
                        ? {
                              x: `${-maxOffset / size.width}`,
                              y: `${-maxOffset / size.height}`,
                              width: `${frame.width / size.width}`,
                              height: `${frame.height / size.height}`,
                          }
                        : frame
                          ? {
                                filterUnits: "userSpaceOnUse",
                                x: `${-maxOffset}px`,
                                y: `${-maxOffset}px`,
                                width: `${frame.width}px`,
                                height: `${frame.height}px`,
                            }
                          : maxOffset > 0
                            ? FALLBACK_FILTER_REGION
                            : undefined;

                return {
                    region,
                    frame,
                    inputs: kept.map((key, index) => ({
                        key,
                        srcIn: method === "chain" && index > 0 ? kept[index - 1] : SOURCE_GRAPHIC,
                    })),
                    mergeKeys: method === "isolate" ? [SOURCE_GRAPHIC, ...kept] : undefined,
                };
            },
        };
    };

    /**
     * A `baseFrequency` attribute from one frequency for both axes or one per axis.
     *
     * @param value The frequency, or `x` and `y` separately.
     */
    export const computeBaseFrequency = (value: number | Point2d) =>
        typeof value === "number" ? `${value}` : `${value.x} ${value.y}`;

    /**
     * The color matrix that multiplies red, green and blue by one amount, leaving opacity alone.
     *
     * @param defs.amount `0` is black, `1` leaves the colors alone, above `1` brightens.
     */
    export const computeBrightnessMatrix = (defs: SVGBrightnessFilterDefs) =>
        computeChannelMatrix(defs.amount, defs.amount, defs.amount, 0);

    /**
     * The color matrix that pushes every channel away from mid-grey or pulls it towards it, leaving opacity alone.
     *
     * @param defs.amount `0` is flat mid-grey, `1` leaves the colors alone, above `1` raises the contrast.
     */
    export const computeContrastMatrix = (defs: SVGContrastFilterDefs) =>
        computeChannelMatrix(defs.amount, defs.amount, defs.amount, 0.5 * (1 - defs.amount));

    /**
     * The color matrix that inverts red, green and blue, leaving opacity alone.
     *
     * @param defs.amount `1` is a full inversion, `0.5` is flat mid-grey, `0` leaves the colors alone.
     */
    export const computeInversionMatrix = (defs: SVGInversionFilterDefs) => {
        const slope = 1 - 2 * defs.amount;

        return computeChannelMatrix(slope, slope, slope, defs.amount);
    };

    /**
     * The color matrix that multiplies red, green and blue each by its own amount, leaving opacity alone.
     *
     * @param defs The multiplier for each channel.
     */
    export const computeColorChannelMatrix = (defs: SVGColorFilterDefs) =>
        computeChannelMatrix(defs.r, defs.g, defs.b, 0);

    /**
     * The names of every intermediate result the RGB split's primitives write.
     *
     * The graphic is copied three times, each copy keeping one of red, green and blue through
     * {@link computeRGBSplitMatrix}, so a caller shifts each copy on its own and blends the three back together with
     * {@link getRGBSplitBlendMode}.
     *
     * @param key The result name {@link createRegistry}'s `addRGBSplit` answered, which every intermediate result is
     * named from.
     * @returns For red, green and blue in that order, the names of its kept and shifted copies, then the name of the
     * red and green copies blended together.
     */
    export const resolveRGBSplit = (key: string) => ({
        channels: Array.from({ length: RGB_CHANNEL_COUNT }, (_, index) => ({
            kept: `${key}_${index}_kept`,
            shifted: `${key}_${index}_shifted`,
        })),
        redGreen: `${key}_red_green`,
    });

    /**
     * The color matrix that keeps one channel of the graphic for the RGB split, leaving opacity alone.
     *
     * Additive mixing empties the other two channels, so the copy is that channel's light on black; subtractive
     * mixing fills them, so the copy is the ink that takes away only that channel, on white. Either way, three copies
     * still lying on top of one another blend back into the original colors.
     *
     * @param channelIndex `0` for red, `1` for green, `2` for blue.
     * @param colorMixing How the three copies are put back together. Left out, `SVG_FILTER_DEFAULTS.colorMixing`.
     */
    export const computeRGBSplitMatrix = (channelIndex: number, colorMixing: SVGColorMixing | undefined) => {
        const fill = RGB_SPLIT_FILLS[colorMixing ?? SVG_FILTER_DEFAULTS.colorMixing];
        const rows = Array.from({ length: RGB_CHANNEL_COUNT }, (_, row) =>
            Array.from({ length: MATRIX_ROW_LENGTH }, (_, column) =>
                row === channelIndex ? (column === row ? 1 : 0) : column === MATRIX_ROW_LENGTH - 1 ? fill : 0,
            ).join(" "),
        );

        return [...rows, ALPHA_ROW].join(" ");
    };

    /**
     * The blend mode that puts the RGB split's three copies back together.
     *
     * Screening adds light, so additive copies come back to the original and drift apart into red, green and blue
     * fringes, which read on a dark ground. Multiplying layers inks, so subtractive copies come back the same and
     * drift apart into cyan, magenta and yellow fringes, which read on a light one. Opacity is combined the same way
     * in both, which is exact for opaque content: a pixel the original painted part see-through comes back somewhat
     * more opaque, since each copy carries that pixel's full opacity.
     *
     * @param colorMixing How the three copies are put back together. Left out, `SVG_FILTER_DEFAULTS.colorMixing`.
     */
    export const getRGBSplitBlendMode = (colorMixing: SVGColorMixing | undefined) =>
        RGB_SPLIT_BLEND_MODES[colorMixing ?? SVG_FILTER_DEFAULTS.colorMixing];

    /**
     * Everything the noise-displacement pair of primitives carries, with the defaults filled in.
     *
     * The noise defaults to one octave of `fractalNoise` at seed `0`, unstitched, driving the horizontal shift
     * from the red channel and the vertical from the green. An `edgeFade` above `0` adds a mask that calms the
     * displacement to nothing within that many user units of the shape's edge; `edgeFadeBlur` is how soft that
     * mask's edge is.
     *
     * @param key The result name {@link createRegistry}'s `addTurbulence` answered, which every intermediate
     * result is named from.
     * @param defs The noise and the displacement.
     * @returns The filled-in settings, the `baseFrequency` attribute, and the name of every intermediate result.
     */
    export const resolveTurbulence = (key: string, defs: SVGTurbulenceFilterDefs) => {
        const defaults = SVG_FILTER_DEFAULTS.turbulence;
        const edgeFade = defs.edgeFade ?? defaults.edgeFade;
        const maskKey = `${key}_mask`;

        return {
            scale: defs.scale,
            type: defs.type ?? defaults.type,
            numOctaves: defs.numOctaves ?? defaults.numOctaves,
            seed: defs.seed ?? defaults.seed,
            stitchTiles: defs.stitchTiles ?? defaults.stitchTiles,
            xChannelSelector: defs.xChannelSelector ?? defaults.xChannelSelector,
            yChannelSelector: defs.yChannelSelector ?? defaults.yChannelSelector,
            edgeFade,
            baseFrequency: computeBaseFrequency(defs.baseFrequency),
            edgeFadeBlur: edgeFade * EDGE_FADE_BLUR_RATIO,
            keys: {
                noise: `${key}_noise`,
                opaque: `${key}_opaque`,
                flat: `${key}_flat`,
                eroded: `${key}_eroded`,
                mask: maskKey,
                maskedNoise: `${maskKey}_in`,
                map: `${key}_map`,
            },
        };
    };

    /**
     * Everything the pixelation's chain of primitives carries.
     *
     * The picture is sampled once at the middle of every square cell and each sample is grown back out to fill its
     * cell. The samples are taken through an image of the region's own size holding one dot per cell, made opaque
     * wherever it is not empty, since Safari smooths the image and leaves each dot part transparent; the graphic is
     * kept only where a dot lands, and every kept pixel is dilated by half a cell. The image is used rather than one
     * flooded dot tiled across the region, the construction usually published, because Safari draws nothing at all
     * for that one.
     *
     * @param key The result name {@link createRegistry}'s `addPixelate` answered, which every intermediate result is
     * named from.
     * @param defs How wide each square is, in user units.
     * @param frame The region's size in pixels and how far it reaches past the element on each side, from the
     * assembly. The cells are counted from the element's corner, not the region's.
     * @returns The dot image as a data URI, the dilation radius, and the name of every intermediate result.
     */
    export const resolvePixelate = (key: string, defs: SVGPixelateFilterDefs, frame: SVGFilterFrame) => {
        const size = Math.max(defs.size, 1);
        const half = size * 0.5;
        const dot = Math.floor(half);
        const svg = [
            `<svg xmlns="http://www.w3.org/2000/svg" width="${frame.width}" height="${frame.height}">`,
            `<defs><pattern id="d" x="${frame.offset}" y="${frame.offset}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">`,
            `<rect x="${dot}" y="${dot}" width="1" height="1"/></pattern></defs>`,
            `<rect width="100%" height="100%" fill="url(#d)"/></svg>`,
        ].join("");

        return {
            gridHref: `data:image/svg+xml,${encodeURIComponent(svg)}`,
            radius: half,
            keys: {
                dots: `${key}_dots`,
                grid: `${key}_grid`,
                sampled: `${key}_sampled`,
            },
        };
    };
}
