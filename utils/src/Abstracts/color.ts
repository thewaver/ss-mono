import { colord, extend, getFormat } from "colord";
import namesPlugin from "colord/plugins/names";

const CHANNEL_MAX = 255;
const HUE_MAX = 360;
const HUE_HALF = 180;
const HUE_SECTORS = 6;
const HEX_LENGTH = 7;
const HEX_SHORT_LENGTH = 4;
const HEXA_LENGTH = 9;
const HEXA_SHORT_LENGTH = 5;
const HEXA_LENGTHS = [HEX_SHORT_LENGTH, HEXA_SHORT_LENGTH, HEX_LENGTH, HEXA_LENGTH];
const ALPHA_OPAQUE = 1;
const HEX_RADIX = 16;
const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const HEXA_PATTERN = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const PERCENT_MAX = 100;
const PERCENT_DECIMALS = 2;
const LUMINANCE_LINEAR_MAX = 0.03928;
const LUMINANCE_LINEAR_DIVISOR = 12.92;
const LUMINANCE_GAMMA_OFFSET = 0.055;
const LUMINANCE_GAMMA_DIVISOR = 1.055;
const LUMINANCE_GAMMA_EXPONENT = 2.4;
const LUMINANCE_RED = 0.2126;
const LUMINANCE_GREEN = 0.7152;
const LUMINANCE_BLUE = 0.0722;
const LUMINANCE_MIN = 0;
const LUMINANCE_MAX = 1;
const CONTRAST_LEVELS: Record<Color.ContrastLevel, number> = { A: 3, AA: 4.5, AAA: 7 };
const CONTRAST_OFFSET = 0.05;
const CONTRAST_MIN = 1;
const CONTRAST_MAX = 21;
const LIGHTNESS_BISECTIONS = 24;
const LIGHTNESS_ROUNDING = 100;
const HALF = 0.5;

extend([namesPlugin]);
const ALPHA_DECIMALS = 3;

// GENERIC

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const toChannel = (value: number) => clamp(Math.round(value), 0, CHANNEL_MAX);

const toHexPair = (value: number) => toChannel(value).toString(HEX_RADIX).padStart(2, "0");

const toHue = (value: number) => Number((((value % HUE_MAX) + HUE_MAX) % HUE_MAX).toFixed(PERCENT_DECIMALS));

const toPercent = (value: number) => `${Number((clamp(value, 0, 1) * PERCENT_MAX).toFixed(PERCENT_DECIMALS))}%`;

const toAlpha = (value: number) => Number(clamp(value, 0, ALPHA_OPAQUE).toFixed(ALPHA_DECIMALS));

const mix = (from: number, to: number, ratio: number) => from + (to - from) * clamp(ratio, 0, 1);

const mixHue = (from: number, to: number, ratio: number) => {
    const gap = (((to - from) % HUE_MAX) + HUE_MAX) % HUE_MAX;
    const delta = gap > HUE_HALF ? gap - HUE_MAX : gap;

    return toHue(from + delta * clamp(ratio, 0, 1));
};

const toLinearChannel = (value: number) => {
    const channel = clamp(value, 0, CHANNEL_MAX) / CHANNEL_MAX;

    return channel <= LUMINANCE_LINEAR_MAX
        ? channel / LUMINANCE_LINEAR_DIVISOR
        : ((channel + LUMINANCE_GAMMA_OFFSET) / LUMINANCE_GAMMA_DIVISOR) ** LUMINANCE_GAMMA_EXPONENT;
};

const toLuminance = (rgb: Color.RGB) =>
    LUMINANCE_RED * toLinearChannel(rgb.r) +
    LUMINANCE_GREEN * toLinearChannel(rgb.g) +
    LUMINANCE_BLUE * toLinearChannel(rgb.b);

const toContrastRatio = (first: number, second: number) =>
    (Math.max(first, second) + CONTRAST_OFFSET) / (Math.min(first, second) + CONTRAST_OFFSET);

const toContrastRgb = (value: string | Color.RGB) => {
    if (typeof value !== "string") return value;

    const parsed = Color.parse(value);

    return parsed && Color.HSVA.toRgba(parsed);
};

/**
 * Color values, the conversions between them, and the reading of CSS color strings.
 *
 * Every color space gets a type describing its shape and a namespace of the same name holding
 * its operations, so `Color.HSL` is both the value and the place its functions live. Conversions
 * are named after their destination: `Color.RGB.toHsl` takes an `RGB` and returns an `HSL`.
 *
 * **Units follow CSS.** Hue is `0`–`360` degrees, saturation, value and lightness are `0`–`100`
 * percentages, red, green and blue are `0`–`255`, and alpha alone is a `0`–`1` fraction.
 *
 * Spaces come in pairs. The plain form carries no transparency; the `A` form adds a required
 * `a` field, and only the `A` forms convert to each other. Inputs are clamped to their valid
 * range rather than rejected, so a nonsensical value produces the nearest sensible color
 * instead of an error.
 *
 * Every space also carries an `interpolate`, which blends two of its own values. Blending is
 * done in the space it is called on and the result is a value of that space, so the path taken
 * between two colors is the caller's choice: `RGB.interpolate` walks a straight line through
 * the channels, while `HSL.interpolate` and `HSV.interpolate` travel around the hue circle by
 * the shorter arc and so keep saturated colors saturated on the way.
 */
export namespace Color {
    /** Red, green and blue, each `0`–`255`. Values may be fractional; they are rounded on output. */
    export type RGB = {
        r: number;
        g: number;
        b: number;
    };

    /** An {@link RGB} with an opacity of `0` (fully transparent) to `1` (fully opaque). */
    export type RGBA = RGB & {
        a: number;
    };

    /** Hue in degrees `0`–`360`, plus saturation and value as percentages `0`–`100`, as CSS writes them. */
    export type HSV = {
        h: number;
        s: number;
        v: number;
    };

    /** An {@link HSV} with an opacity of `0` (fully transparent) to `1` (fully opaque). */
    export type HSVA = HSV & {
        a: number;
    };

    /** Hue in degrees `0`–`360`, plus saturation and lightness as percentages `0`–`100`, as CSS writes them. */
    export type HSL = {
        h: number;
        s: number;
        l: number;
    };

    /** An {@link HSL} with an opacity of `0` (fully transparent) to `1` (fully opaque). */
    export type HSLA = HSL & {
        a: number;
    };

    /**
     * A `#` followed by 3 or 6 hexadecimal digits, such as `#f0a` or `#ff00aa`.
     *
     * Only the leading `#` is checked by the compiler; use {@link Hex.isHex} to confirm the rest.
     */
    export type Hex = `#${string}`;

    /**
     * A {@link Hex} that may also carry an alpha pair, so 3, 4, 6 or 8 digits — `#f0ac`, `#ff00aacc`.
     *
     * The alpha digits are optional: a 3 or 6 digit value is accepted and read as fully opaque.
     * As with {@link Hex}, only the leading `#` is checked by the compiler; use {@link Hexa.isHexa}
     * to confirm the rest.
     */
    export type Hexa = `#${string}`;

    /** Names of the color spaces that carry transparency, for callers that switch on one. */
    export type ValueSpace = "rgba" | "hsla" | "hsva" | "hexa";

    /** The notations a CSS color string can arrive in, as {@link Color.getNotationOf} reports them. */
    export type Notation = "hex" | "rgb" | "hsl" | "name";

    /**
     * A contrast ratio named rather than written out, for {@link Color.getContrastingColor}.
     *
     * `AA` is `4.5` and `AAA` is `7`, the ratios WCAG asks of normal text. `A` is `3`, which is what
     * large text — 18pt, or 14pt bold — and non-text things such as icons and input borders have to
     * reach. WCAG attaches no contrast requirement to level A itself, so read `A` as the name of the
     * `3` threshold rather than as a conformance level.
     */
    export type ContrastLevel = "A" | "AA" | "AAA";

    /**
     * Which side of the other color to come back on.
     *
     * `darker` and `lighter` describe the answer relative to the color it was measured against, so text
     * on a pale surface wants `darker`. `auto` takes whichever side has more room to move, which is the
     * lighter side for a dark color and the darker side for a light one.
     */
    export type ContrastSide = "darker" | "lighter" | "auto";

    /** Options for {@link Color.getContrastingColor}. */
    export type ContrastOptions = {
        /**
         * Which side of the other color to prefer, `auto` when left out.
         *
         * It only chooses between two colors that both reach the target. Where the preferred side cannot
         * reach it and the opposite side can, the opposite side is answered with rather than refused.
         */
        prefer?: Color.ContrastSide;
        /**
         * Whether a target nothing can reach answers with `undefined` instead of the closest miss.
         *
         * Off when left out, so an unreachable target comes back as black or white — whichever of the two
         * contrasts more. Turn it on where a color that falls short is worse than no color at all.
         */
        mustMeetTargetContrast?: boolean;
    };

    /**
     * Reads any CSS color string into hue, saturation, value and alpha.
     *
     * Reads hex of any length, `rgb()` and `hsl()` in both the comma and the space syntax, and the named
     * colors. A value taken through here and written back out comes back unchanged, so a control can hold
     * its color in this form without it drifting.
     *
     * @param value The string to read.
     * @returns The color, or `undefined` when the string is not a color this can read. Nothing is
     * substituted for an unreadable value, so a caller wanting a fallback supplies its own.
     */
    export const parse = (value: string): Color.HSVA | undefined => {
        const parsed = colord(value);

        return parsed.isValid() ? RGBA.toHsva(parsed.toRgb()) : undefined;
    };

    /**
     * Which notation a color string was written in.
     *
     * Paired with {@link Color.toNotation} it is what lets a control hand a value back in the notation it
     * was given — put `hsl(...)` in and get `hsl(...)` out, rather than everything collapsing to hex.
     *
     * @param value The string to inspect.
     * @returns The notation, or `undefined` when the string is not a color.
     */
    export const getNotationOf = (value: string): Color.Notation | undefined => {
        const format = getFormat(value);

        return format === "hex" || format === "rgb" || format === "hsl" || format === "name" ? format : undefined;
    };

    /**
     * Writes a color out in a chosen notation.
     *
     * @param hsva The color to write.
     * @param notation Which spelling to use. `name` has no general inverse, since not every color has a
     * name, so it is written as hex — the nearest exact thing.
     * @returns The formatted string.
     */
    export const toNotation = (hsva: Color.HSVA, notation: Color.Notation): string => {
        if (notation === "rgb") return RGBA.toCss(HSVA.toRgba(hsva));
        if (notation === "hsl") return HSLA.toCss(HSVA.toHsla(hsva));

        return HSVA.getClampedAlpha(hsva) === ALPHA_OPAQUE ? HSV.toHex(hsva) : HSVA.toHexa(hsva);
    };

    /**
     * Whether two color strings describe the same color, whatever notation each is written in.
     *
     * @param a The first color.
     * @param b The second color.
     * @returns `true` when both name the same color and opacity, so `#abcf` matches `#aabbccff` and `red`
     * matches `#ff0000`. `false` when either cannot be read.
     */
    export const isSame = (a: string, b: string) => {
        const left = colord(a);

        return left.isValid() && colord(b).isValid() && left.isEqual(b);
    };

    /**
     * Finds the lightness that makes a hue and a saturation contrast with another color.
     *
     * The hue and the saturation are kept and only the lightness moves, so a color kept for its character
     * keeps it while becoming readable against a known background. Contrast is WCAG's ratio, running from
     * `1` for two identical colors to `21` for black against white.
     *
     * Any reachable target is reached twice — once by a color darker than the other one and once by a color
     * lighter than it — and each answer is the nearest to the other color on its own side, so what comes
     * back is the smallest change that passes rather than the most extreme one. `options.prefer` picks
     * between the two.
     *
     * Opacity takes no part: a translucent color is measured as though it were opaque, because what a
     * see-through color really contrasts with is whatever happens to be behind it.
     *
     * @param hue The hue to keep, in degrees. Wraps, so `-30` and `330` mean the same thing.
     * @param saturation The saturation to keep, as a percentage, clamped to `0`–`100`.
     * @param against The color to contrast with, as a CSS color string or a {@link Color.RGB} value.
     * @param target The ratio to reach, as a number clamped to `1`–`21` or a {@link Color.ContrastLevel}.
     * @param options Which side to prefer, and whether a miss is acceptable.
     * @returns The color as {@link Color.HSL}, its lightness carrying two decimals and rounded in the
     * direction that keeps the target met. `undefined` when `against` is a string that is not a color, and
     * when nothing reaches the target while `options.mustMeetTargetContrast` is set.
     */
    export const getContrastingColor = (
        hue: number,
        saturation: number,
        against: string | Color.RGB,
        target: number | Color.ContrastLevel,
        options?: Color.ContrastOptions,
    ): Color.HSL | undefined => {
        const other = toContrastRgb(against);

        if (!other) return undefined;

        const h = toHue(hue);
        const s = clamp(saturation, 0, PERCENT_MAX);
        const ratio = clamp(typeof target === "number" ? target : CONTRAST_LEVELS[target], CONTRAST_MIN, CONTRAST_MAX);
        const otherLuminance = toLuminance(other);

        const darkerLimit = (otherLuminance + CONTRAST_OFFSET) / ratio - CONTRAST_OFFSET;
        const lighterLimit = ratio * (otherLuminance + CONTRAST_OFFSET) - CONTRAST_OFFSET;
        const widestSide =
            toContrastRatio(LUMINANCE_MIN, otherLuminance) >= toContrastRatio(LUMINANCE_MAX, otherLuminance)
                ? "darker"
                : "lighter";

        const preferred = !options?.prefer || options.prefer === "auto" ? widestSide : options.prefer;
        const opposite = preferred === "darker" ? "lighter" : "darker";
        const reaches = { darker: darkerLimit >= LUMINANCE_MIN, lighter: lighterLimit <= LUMINANCE_MAX };
        const side = reaches[preferred] ? preferred : reaches[opposite] ? opposite : undefined;

        if (!side) {
            if (options?.mustMeetTargetContrast) return undefined;

            return { h, s, l: widestSide === "darker" ? 0 : PERCENT_MAX };
        }

        const limit = side === "darker" ? darkerLimit : lighterLimit;

        let low = 0;
        let high = PERCENT_MAX;

        for (let iteration = 0; iteration < LIGHTNESS_BISECTIONS; iteration++) {
            const lightness = (low + high) * HALF;

            if (toLuminance(HSL.toRgb({ h, s, l: lightness })) <= limit) low = lightness;
            else high = lightness;
        }

        const scaled = low * LIGHTNESS_ROUNDING;

        return {
            h,
            s,
            l: clamp((side === "darker" ? Math.floor(scaled) : Math.ceil(scaled)) / LIGHTNESS_ROUNDING, 0, PERCENT_MAX),
        };
    };

    /** Operations on {@link Color.RGB} values. */
    export namespace RGB {
        /**
         * Blends towards another color, channel by channel.
         *
         * @param from The color at a ratio of `0`.
         * @param to The color at a ratio of `1`.
         * @param ratio How far to travel, clamped to `0`–`1`.
         * @returns The blended color. Channels may be fractional; they are rounded on output.
         */
        export const interpolate = (from: Color.RGB, to: Color.RGB, ratio: number): Color.RGB => ({
            r: mix(from.r, to.r, ratio),
            g: mix(from.g, to.g, ratio),
            b: mix(from.b, to.b, ratio),
        });

        /**
         * Formats the color as a CSS `rgb()` string.
         *
         * @param rgb The color to format.
         * @returns A string such as `rgb(255 128 0)`, with channels rounded to whole numbers.
         */
        export const toCss = (rgb: Color.RGB) => `rgb(${toChannel(rgb.r)} ${toChannel(rgb.g)} ${toChannel(rgb.b)})`;

        /**
         * Converts to a 6 digit hex string.
         *
         * @param rgb The color to convert.
         * @returns A lowercase value such as `#ff8000`. Channels are rounded and clamped to `0`–`255`.
         */
        export const toHex = (rgb: Color.RGB): Color.Hex =>
            `#${toHexPair(rgb.r)}${toHexPair(rgb.g)}${toHexPair(rgb.b)}`;

        /**
         * Converts to hue, saturation and lightness.
         *
         * @param rgb The color to convert.
         * @returns The same color expressed as {@link Color.HSL}.
         */
        export const toHsl = (rgb: Color.RGB): Color.HSL => {
            const hsv = toHsv(rgb);
            const v = hsv.v / PERCENT_MAX;
            const s = hsv.s / PERCENT_MAX;
            const l = v * (1 - s * 0.5);

            return {
                h: hsv.h,
                s: (l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l)) * PERCENT_MAX,
                l: l * PERCENT_MAX,
            };
        };

        /**
         * Converts to hue, saturation and value.
         *
         * @param rgb The color to convert.
         * @returns The same color expressed as {@link Color.HSV}. Grays come back with a hue of `0`.
         */
        export const toHsv = (rgb: Color.RGB): Color.HSV => {
            const r = clamp(rgb.r, 0, CHANNEL_MAX) / CHANNEL_MAX;
            const g = clamp(rgb.g, 0, CHANNEL_MAX) / CHANNEL_MAX;
            const b = clamp(rgb.b, 0, CHANNEL_MAX) / CHANNEL_MAX;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const span = max - min;

            const sector =
                span === 0
                    ? 0
                    : max === r
                      ? ((g - b) / span + HUE_SECTORS) % HUE_SECTORS
                      : max === g
                        ? (b - r) / span + 2
                        : (r - g) / span + 4;

            return {
                h: (sector * (HUE_MAX / HUE_SECTORS) + HUE_MAX) % HUE_MAX,
                s: (max === 0 ? 0 : span / max) * PERCENT_MAX,
                v: max * PERCENT_MAX,
            };
        };
    }

    /** Operations on {@link Color.RGBA} values. */
    export namespace RGBA {
        /**
         * Blends towards another color, channel by channel, including the opacity.
         *
         * @param from The color at a ratio of `0`.
         * @param to The color at a ratio of `1`.
         * @param ratio How far to travel, clamped to `0`–`1`.
         * @returns The blended color. The opacity travels with the channels rather than being
         * applied to the result, so fading between two half transparent colors stays half
         * transparent throughout.
         */
        export const interpolate = (from: Color.RGBA, to: Color.RGBA, ratio: number): Color.RGBA => ({
            ...RGB.interpolate(from, to, ratio),
            a: mix(from.a, to.a, ratio),
        });

        /**
         * Formats the color as a CSS `rgb()` string with an alpha component.
         *
         * @param rgba The color to format.
         * @returns A string such as `rgb(255 128 0 / 0.5)`.
         */
        export const toCss = (rgba: Color.RGBA) =>
            `rgb(${toChannel(rgba.r)} ${toChannel(rgba.g)} ${toChannel(rgba.b)} / ${toAlpha(rgba.a)})`;

        /**
         * Converts to an 8 digit hex string.
         *
         * @param rgba The color to convert.
         * @returns A value such as `#ff800080`. The alpha pair is always written, even when opaque.
         */
        export const toHexa = (rgba: Color.RGBA): Color.Hexa =>
            `${RGB.toHex(rgba)}${toHexPair(clamp(rgba.a, 0, ALPHA_OPAQUE) * CHANNEL_MAX)}`;

        /**
         * Converts to hue, saturation and lightness, keeping the opacity.
         *
         * @param rgba The color to convert.
         * @returns The same color as {@link Color.HSLA}, with alpha clamped to `0`–`1`.
         */
        export const toHsla = (rgba: Color.RGBA): Color.HSLA => ({
            ...RGB.toHsl(rgba),
            a: clamp(rgba.a, 0, ALPHA_OPAQUE),
        });

        /**
         * Converts to hue, saturation and value, keeping the opacity.
         *
         * @param rgba The color to convert.
         * @returns The same color as {@link Color.HSVA}, with alpha clamped to `0`–`1`.
         */
        export const toHsva = (rgba: Color.RGBA): Color.HSVA => ({
            ...RGB.toHsv(rgba),
            a: clamp(rgba.a, 0, ALPHA_OPAQUE),
        });
    }

    /** Operations on {@link Color.HSV} values. */
    export namespace HSV {
        /**
         * Blends towards another color, taking the shorter way around the hue circle.
         *
         * @param from The color at a ratio of `0`.
         * @param to The color at a ratio of `1`.
         * @param ratio How far to travel, clamped to `0`–`1`.
         * @returns The blended color. Hue crosses `0` when that is the shorter arc, so blending
         * from `350` to `10` passes through `0` rather than running back down through `180`. Where
         * the two hues are exactly opposite, the increasing direction is taken.
         */
        export const interpolate = (from: Color.HSV, to: Color.HSV, ratio: number): Color.HSV => ({
            h: mixHue(from.h, to.h, ratio),
            s: mix(from.s, to.s, ratio),
            v: mix(from.v, to.v, ratio),
        });

        /**
         * Formats the color as a CSS `hwb()` string.
         *
         * CSS has no `hsv()` notation, so this writes `hwb()` — the same hue with whiteness and
         * blackness, which is HSV under another name and converts exactly.
         *
         * @param hsv The color to format.
         * @returns A string such as `hwb(210 7.06% 66.27%)`.
         */
        export const toCss = (hsv: Color.HSV) => {
            const s = clamp(hsv.s, 0, PERCENT_MAX) / PERCENT_MAX;
            const v = clamp(hsv.v, 0, PERCENT_MAX) / PERCENT_MAX;

            return `hwb(${toHue(hsv.h)} ${toPercent(v * (1 - s))} ${toPercent(1 - v)})`;
        };

        /**
         * Converts to red, green and blue.
         *
         * @param hsv The color to convert. Hue wraps, so `-30` and `330` mean the same thing.
         * @returns The same color as {@link Color.RGB}, with fractional channels.
         */
        export const toRgb = (hsv: Color.HSV): Color.RGB => {
            const h = ((hsv.h % HUE_MAX) + HUE_MAX) % HUE_MAX;
            const s = clamp(hsv.s, 0, PERCENT_MAX) / PERCENT_MAX;
            const v = clamp(hsv.v, 0, PERCENT_MAX) / PERCENT_MAX;

            const sector = h / (HUE_MAX / HUE_SECTORS);
            const offset = sector - Math.floor(sector);

            const p = v * (1 - s);
            const q = v * (1 - s * offset);
            const t = v * (1 - s * (1 - offset));

            const channels: [number, number, number][] = [
                [v, t, p],
                [q, v, p],
                [p, v, t],
                [p, q, v],
                [t, p, v],
                [v, p, q],
            ];
            const [r, g, b] = channels[Math.floor(sector) % HUE_SECTORS];

            return { r: r * CHANNEL_MAX, g: g * CHANNEL_MAX, b: b * CHANNEL_MAX };
        };

        /**
         * Converts to a 6 digit hex string.
         *
         * @param hsv The color to convert.
         * @returns A lowercase value such as `#ff8000`.
         */
        export const toHex = (hsv: Color.HSV): Color.Hex => RGB.toHex(toRgb(hsv));

        /**
         * Converts to hue, saturation and lightness.
         *
         * @param hsv The color to convert.
         * @returns The same color as {@link Color.HSL}. The hue is carried across unchanged.
         */
        export const toHsl = (hsv: Color.HSV): Color.HSL => RGB.toHsl(toRgb(hsv));
    }

    /** Operations on {@link Color.HSVA} values. */
    export namespace HSVA {
        /**
         * Reads the opacity, clamped to `0`–`1`.
         *
         * @param hsva The color to read.
         * @returns The alpha, or `1` if the field is missing at runtime.
         */
        export const getClampedAlpha = (hsva: Color.HSVA) => clamp(hsva.a ?? ALPHA_OPAQUE, 0, ALPHA_OPAQUE);

        /**
         * Blends towards another color around the hue circle, including the opacity.
         *
         * @param from The color at a ratio of `0`.
         * @param to The color at a ratio of `1`.
         * @param ratio How far to travel, clamped to `0`–`1`.
         * @returns The blended color, with hue handled as {@link HSV.interpolate} describes.
         */
        export const interpolate = (from: Color.HSVA, to: Color.HSVA, ratio: number): Color.HSVA => ({
            ...HSV.interpolate(from, to, ratio),
            a: mix(from.a, to.a, ratio),
        });

        /**
         * Formats the color as a CSS `hwb()` string with an alpha component.
         *
         * CSS has no `hsv()` notation, so this writes `hwb()` with an alpha component, as
         * {@link HSV.toCss} describes.
         *
         * @param hsva The color to format.
         * @returns A string such as `hwb(210 7.06% 66.27% / 0.5)`.
         */
        export const toCss = (hsva: Color.HSVA) => {
            const s = clamp(hsva.s, 0, PERCENT_MAX) / PERCENT_MAX;
            const v = clamp(hsva.v, 0, PERCENT_MAX) / PERCENT_MAX;

            return `hwb(${toHue(hsva.h)} ${toPercent(v * (1 - s))} ${toPercent(1 - v)} / ${toAlpha(hsva.a)})`;
        };

        /**
         * Converts to red, green and blue, keeping the opacity.
         *
         * @param hsva The color to convert.
         * @returns The same color as {@link Color.RGBA}.
         */
        export const toRgba = (hsva: Color.HSVA): Color.RGBA => ({
            ...HSV.toRgb(hsva),
            a: getClampedAlpha(hsva),
        });

        /**
         * Converts to an 8 digit hex string.
         *
         * @param hsva The color to convert.
         * @returns A value such as `#ff800080`.
         */
        export const toHexa = (hsva: Color.HSVA): Color.Hexa => RGBA.toHexa(toRgba(hsva));

        /**
         * Converts to hue, saturation and lightness, keeping the opacity.
         *
         * @param hsva The color to convert.
         * @returns The same color as {@link Color.HSLA}.
         */
        export const toHsla = (hsva: Color.HSVA): Color.HSLA => ({
            ...HSV.toHsl(hsva),
            a: getClampedAlpha(hsva),
        });
    }

    /** Operations on {@link Color.HSL} values. */
    export namespace HSL {
        /**
         * Blends towards another color, taking the shorter way around the hue circle.
         *
         * @param from The color at a ratio of `0`.
         * @param to The color at a ratio of `1`.
         * @param ratio How far to travel, clamped to `0`–`1`.
         * @returns The blended color. Hue crosses `0` when that is the shorter arc, so blending
         * from `350` to `10` passes through `0` rather than running back down through `180`. Where
         * the two hues are exactly opposite, the increasing direction is taken.
         */
        export const interpolate = (from: Color.HSL, to: Color.HSL, ratio: number): Color.HSL => ({
            h: mixHue(from.h, to.h, ratio),
            s: mix(from.s, to.s, ratio),
            l: mix(from.l, to.l, ratio),
        });

        /**
         * Formats the color as a CSS `hsl()` string.
         *
         * @param hsl The color to format.
         * @returns A string such as `hsl(210 65.38% 20.39%)`.
         */
        export const toCss = (hsl: Color.HSL) =>
            `hsl(${toHue(hsl.h)} ${toPercent(hsl.s / PERCENT_MAX)} ${toPercent(hsl.l / PERCENT_MAX)})`;

        /**
         * Converts to red, green and blue.
         *
         * @param hsl The color to convert. Hue wraps, so `-30` and `330` mean the same thing.
         * @returns The same color as {@link Color.RGB}, with fractional channels.
         */
        export const toRgb = (hsl: Color.HSL): Color.RGB => {
            const l = clamp(hsl.l, 0, PERCENT_MAX) / PERCENT_MAX;
            const s = clamp(hsl.s, 0, PERCENT_MAX) / PERCENT_MAX;
            const v = l + s * Math.min(l, 1 - l);

            return HSV.toRgb({
                h: hsl.h,
                s: (v === 0 ? 0 : 2 * (1 - l / v)) * PERCENT_MAX,
                v: v * PERCENT_MAX,
            });
        };

        /**
         * Converts to a 6 digit hex string.
         *
         * @param hsl The color to convert.
         * @returns A lowercase value such as `#ff8000`.
         */
        export const toHex = (hsl: Color.HSL): Color.Hex => RGB.toHex(toRgb(hsl));

        /**
         * Converts to hue, saturation and value.
         *
         * @param hsl The color to convert.
         * @returns The same color as {@link Color.HSV}. The hue is carried across unchanged.
         */
        export const toHsv = (hsl: Color.HSL): Color.HSV => RGB.toHsv(toRgb(hsl));
    }

    /** Operations on {@link Color.HSLA} values. */
    export namespace HSLA {
        /**
         * Blends towards another color around the hue circle, including the opacity.
         *
         * @param from The color at a ratio of `0`.
         * @param to The color at a ratio of `1`.
         * @param ratio How far to travel, clamped to `0`–`1`.
         * @returns The blended color, with hue handled as {@link HSL.interpolate} describes.
         */
        export const interpolate = (from: Color.HSLA, to: Color.HSLA, ratio: number): Color.HSLA => ({
            ...HSL.interpolate(from, to, ratio),
            a: mix(from.a, to.a, ratio),
        });

        /**
         * Formats the color as a CSS `hsl()` string with an alpha component.
         *
         * @param hsla The color to format.
         * @returns A string such as `hsl(210 65.38% 20.39% / 0.5)`.
         */
        export const toCss = (hsla: Color.HSLA) =>
            `hsl(${toHue(hsla.h)} ${toPercent(hsla.s / PERCENT_MAX)} ${toPercent(hsla.l / PERCENT_MAX)} / ${toAlpha(hsla.a)})`;

        /**
         * Converts to red, green and blue, keeping the opacity.
         *
         * @param hsla The color to convert.
         * @returns The same color as {@link Color.RGBA}, with alpha clamped to `0`–`1`.
         */
        export const toRgba = (hsla: Color.HSLA): Color.RGBA => ({
            ...HSL.toRgb(hsla),
            a: clamp(hsla.a, 0, ALPHA_OPAQUE),
        });

        /**
         * Converts to an 8 digit hex string.
         *
         * @param hsla The color to convert.
         * @returns A value such as `#ff800080`.
         */
        export const toHexa = (hsla: Color.HSLA): Color.Hexa => RGBA.toHexa(toRgba(hsla));

        /**
         * Converts to hue, saturation and value, keeping the opacity.
         *
         * @param hsla The color to convert.
         * @returns The same color as {@link Color.HSVA}.
         */
        export const toHsva = (hsla: Color.HSLA): Color.HSVA => RGBA.toHsva(toRgba(hsla));
    }

    /** Operations on {@link Color.Hex} values. */
    export namespace Hex {
        /**
         * Blends towards another color through {@link Color.RGB}.
         *
         * @param from A color that has passed {@link isHex}, at a ratio of `0`.
         * @param to A color that has passed {@link isHex}, at a ratio of `1`.
         * @param ratio How far to travel, clamped to `0`–`1`.
         * @returns The blended color as a six digit hex value. The blend runs through the channels
         * rather than around the hue circle, so two saturated colors pass through a duller mixture
         * between them; use {@link Color.HSL.interpolate} to keep the saturation up.
         */
        export const interpolate = (from: Color.Hex, to: Color.Hex, ratio: number): Color.Hex =>
            RGB.toHex(RGB.interpolate(toRgb(from), toRgb(to), ratio));

        /**
         * Checks whether a string is a well formed hex color without an alpha pair.
         *
         * This is the real check — the {@link Color.Hex} type only guarantees the leading `#`, so
         * anything arriving from storage, a URL or user input should pass through here first.
         *
         * @param value The string to test.
         * @returns `true` for 3 or 6 hex digits after the `#`, in either case.
         */
        export const isHex = (value: string): value is Color.Hex =>
            (value.length === HEX_LENGTH || value.length === HEX_SHORT_LENGTH) && HEX_PATTERN.test(value);

        /**
         * Returns the value as a CSS color.
         *
         * @param hex The color to format.
         * @returns The string unchanged — hex is already valid CSS.
         */
        export const toCss = (hex: Color.Hex): string => hex;

        /**
         * Converts to red, green and blue.
         *
         * @param hex A color that has passed {@link isHex}. Short form digits are doubled, so `#f0a`
         * reads as `#ff00aa`.
         * @returns The same color as {@link Color.RGB}.
         */
        export const toRgb = (hex: Color.Hex): Color.RGB => {
            const digits = hex.slice(1);
            const isShort = digits.length === HEX_SHORT_LENGTH - 1;
            const read = (index: number) =>
                isShort
                    ? Number.parseInt(digits[index].repeat(2), HEX_RADIX)
                    : Number.parseInt(digits.slice(index * 2, index * 2 + 2), HEX_RADIX);

            return { r: read(0), g: read(1), b: read(2) };
        };

        /**
         * Converts to hue, saturation and lightness.
         *
         * @param hex A color that has passed {@link isHex}.
         * @returns The same color as {@link Color.HSL}.
         */
        export const toHsl = (hex: Color.Hex): Color.HSL => RGB.toHsl(toRgb(hex));

        /**
         * Converts to hue, saturation and value.
         *
         * @param hex A color that has passed {@link isHex}.
         * @returns The same color as {@link Color.HSV}.
         */
        export const toHsv = (hex: Color.Hex): Color.HSV => RGB.toHsv(toRgb(hex));
    }

    /** Operations on {@link Color.Hexa} values. */
    export namespace Hexa {
        /**
         * Blends towards another color through {@link Color.RGBA}, including the opacity.
         *
         * @param from A color that has passed {@link isHexa}, at a ratio of `0`.
         * @param to A color that has passed {@link isHexa}, at a ratio of `1`.
         * @param ratio How far to travel, clamped to `0`–`1`.
         * @returns The blended color as an eight digit hex value, with the channels handled as
         * {@link Color.Hex.interpolate} describes.
         */
        export const interpolate = (from: Color.Hexa, to: Color.Hexa, ratio: number): Color.Hexa =>
            RGBA.toHexa(RGBA.interpolate(toRgba(from), toRgba(to), ratio));

        /**
         * Checks whether a string is a well formed hex color, with or without an alpha pair.
         *
         * This is the real check — the {@link Color.Hexa} type only guarantees the leading `#`, so
         * anything arriving from storage, a URL or user input should pass through here first.
         *
         * @param value The string to test.
         * @returns `true` for 3, 4, 6 or 8 hex digits after the `#`, in either case.
         */
        export const isHexa = (value: string): value is Color.Hexa =>
            HEXA_LENGTHS.includes(value.length) && HEXA_PATTERN.test(value);

        /**
         * Returns the value as a CSS color.
         *
         * @param hexa The color to format.
         * @returns The string unchanged — hex is already valid CSS.
         */
        export const toCss = (hexa: Color.Hexa): string => hexa;

        /**
         * Converts to red, green and blue, keeping the opacity.
         *
         * @param hexa A color that has passed {@link isHexa}. Short form digits are doubled, and a
         * value with no alpha pair is read as fully opaque.
         * @returns The same color as {@link Color.RGBA}.
         */
        export const toRgba = (hexa: Color.Hexa): Color.RGBA => {
            const digits = hexa.slice(1);
            const isShort = digits.length < HEX_LENGTH - 1;
            const size = isShort ? 1 : 2;
            const read = (index: number) => {
                const slice = digits.slice(index * size, index * size + size);

                return Number.parseInt(isShort ? slice.repeat(2) : slice, HEX_RADIX);
            };
            const hasAlpha = digits.length === HEXA_SHORT_LENGTH - 1 || digits.length === HEXA_LENGTH - 1;

            return {
                r: read(0),
                g: read(1),
                b: read(2),
                a: hasAlpha ? read(3) / CHANNEL_MAX : ALPHA_OPAQUE,
            };
        };

        /**
         * Converts to hue, saturation and lightness, keeping the opacity.
         *
         * @param hexa A color that has passed {@link isHexa}.
         * @returns The same color as {@link Color.HSLA}.
         */
        export const toHsla = (hexa: Color.Hexa): Color.HSLA => RGBA.toHsla(toRgba(hexa));

        /**
         * Converts to hue, saturation and value, keeping the opacity.
         *
         * @param hexa A color that has passed {@link isHexa}.
         * @returns The same color as {@link Color.HSVA}.
         */
        export const toHsva = (hexa: Color.Hexa): Color.HSVA => RGBA.toHsva(toRgba(hexa));
    }
}
