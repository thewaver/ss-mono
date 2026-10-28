import { Color, MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import type { PointerReading } from "../../Abstracts/PointerTracker/PointerTracker.types";
import { LIGHT_CATCHER_DEFAULTS } from "./LightCatcher/LightCatcher.const";
import { SHADOW_CASTER_DEFAULTS } from "./ShadowCaster/ShadowCaster.const";
import type { TilterState } from "./Tilter/Tilter.types";

const FULL_STRENGTH = 1;
const NO_STRENGTH = 0;
const NO_THROW = 0;
const UNTOUCHED_LIGHTNESS = 0;
const FULL_LIGHTNESS = 1;
const CENTER = 0.5;
const FULL_SWING = 2;
const PERCENT = 100;
const SHEEN_OVERTRAVEL = 1.6;
const FALLBACK_COLOR: Color.HSVA = { h: 0, s: 0, v: 0, a: 1 };

/**
 * The arithmetic behind the three pointer effects — `LightCatcher`, `ShadowCaster` and `Tilter` — which each turn a
 * pointer reading into a CSS value on a wrapper.
 *
 * They share the rule for when an effect rests and the falloff that makes it fade as the pointer walks away; the
 * rest is each effect's own sum. Every function takes the reading as `PointerTrackerUtils.observe` reports it, so a
 * framework's view only has to track the pointer, ease the targets these return and write the result.
 */
export namespace PointerEffectsUtils {
    /**
     * Whether an effect should sit at rest rather than answer the pointer.
     *
     * @param isDisabled Whether the effect was turned off.
     * @param isPointerPresent Whether the pointer is over the window at all.
     * @param reading Where the pointer is relative to the effect's element.
     * @param activeRangePx How near the pointer has to be, measured from the element's center. Left out, any
     * distance counts as near.
     * @returns `true` while turned off, while the pointer is away, and while it is outside the active range.
     */
    export const getIsResting = (
        isDisabled: boolean,
        isPointerPresent: boolean,
        reading: PointerReading,
        activeRangePx: number | undefined,
    ) => isDisabled || !isPointerPresent || (activeRangePx !== undefined && reading.distance > activeRangePx);

    /**
     * How strongly an effect answers the pointer, fading from the element's edge out to a range.
     *
     * The fade runs from the edge rather than from the center, so a wide element and a narrow one both reach full
     * strength where they are actually pointed at.
     *
     * @param reading Where the pointer is relative to the element.
     * @param rangePx How far from the center the effect reaches.
     * @returns `1` with the pointer on the element, falling to `0` at the range and beyond. A range no further out
     * than the edge gives `0` everywhere off the element.
     */
    export const computeEdgeStrength = (reading: PointerReading, rangePx: number) => {
        const { distance, edgeDistance } = reading;

        if (distance <= edgeDistance) return FULL_STRENGTH;
        if (rangePx <= edgeDistance) return NO_STRENGTH;

        return MathUtils.clamp01((rangePx - distance) / (rangePx - edgeDistance));
    };

    /**
     * The CSS filter `LightCatcher` writes for a given strength of light.
     *
     * Brightness scales every color, and lightness is a fade toward white done as an inverted brightness, so it lifts
     * the dark parts most. Lightness left at `0` is not written at all.
     *
     * @param strength How lit the surface is, `0` resting to `1` fully lit — already eased by the caller.
     * @param opts The props of the same names. Any left out take `LIGHT_CATCHER_DEFAULTS`.
     * @returns A `filter` value.
     */
    export const computeLightFilter = (
        strength: number,
        opts: {
            restingBrightness?: number;
            maxBrightness?: number;
            restingLightness?: number;
            maxLightness?: number;
        },
    ) => {
        const brightness = `brightness(${MathUtils.lerp(
            opts.restingBrightness ?? LIGHT_CATCHER_DEFAULTS.restingBrightness,
            opts.maxBrightness ?? LIGHT_CATCHER_DEFAULTS.maxBrightness,
            strength,
        )})`;
        const lightness = MathUtils.clamp01(
            MathUtils.lerp(
                opts.restingLightness ?? LIGHT_CATCHER_DEFAULTS.restingLightness,
                opts.maxLightness ?? LIGHT_CATCHER_DEFAULTS.maxLightness,
                strength,
            ),
        );

        if (lightness === UNTOUCHED_LIGHTNESS) return brightness;

        return `${brightness} invert(1) brightness(${FULL_LIGHTNESS - lightness}) invert(1)`;
    };

    /**
     * Where `ShadowCaster`'s shadow should be, before easing.
     *
     * The shadow is thrown away from the pointer, longer, softer and fainter the further off the pointer is, up to
     * `lightRangePx`. At rest it drops straight down at its resting throw, blur and opacity.
     *
     * @param reading Where the pointer is relative to the content.
     * @param isResting Whether the shadow is at rest, from {@link getIsResting}.
     * @param opts The props of the same names. Any left out take `SHADOW_CASTER_DEFAULTS`.
     * @returns `[x, y, blurPx, alpha]`, as the list a smoother follows.
     */
    export const computeShadowTargets = (
        reading: PointerReading,
        isResting: boolean,
        opts: {
            lightRangePx?: number;
            minThrowPx?: number;
            maxThrowPx?: number;
            restingThrowPx?: number;
            minBlurPx?: number;
            maxBlurPx?: number;
            restingBlurPx?: number;
            maxOpacity?: number;
            minOpacity?: number;
            restingOpacity?: number;
        },
    ): number[] => {
        if (isResting) {
            return [
                NO_THROW,
                opts.restingThrowPx ?? SHADOW_CASTER_DEFAULTS.restingThrowPx,
                opts.restingBlurPx ?? SHADOW_CASTER_DEFAULTS.restingBlurPx,
                opts.restingOpacity ?? SHADOW_CASTER_DEFAULTS.restingOpacity,
            ];
        }

        const reach = MathUtils.clamp01(reading.distance / (opts.lightRangePx ?? SHADOW_CASTER_DEFAULTS.lightRangePx));
        const away = Point2dUtils.getNormal(reading.offset);
        const length = MathUtils.lerp(
            opts.minThrowPx ?? SHADOW_CASTER_DEFAULTS.minThrowPx,
            opts.maxThrowPx ?? SHADOW_CASTER_DEFAULTS.maxThrowPx,
            reach,
        );

        return [
            -away.x * length,
            -away.y * length,
            MathUtils.lerp(
                opts.minBlurPx ?? SHADOW_CASTER_DEFAULTS.minBlurPx,
                opts.maxBlurPx ?? SHADOW_CASTER_DEFAULTS.maxBlurPx,
                reach,
            ),
            MathUtils.lerp(
                opts.maxOpacity ?? SHADOW_CASTER_DEFAULTS.maxOpacity,
                opts.minOpacity ?? SHADOW_CASTER_DEFAULTS.minOpacity,
                reach,
            ),
        ];
    };

    /**
     * The CSS filter `ShadowCaster` writes for a shadow.
     *
     * @param shadow `[x, y, blurPx, alpha]`, as {@link computeShadowTargets} returns them and after easing.
     * @param color Any CSS color. Its own alpha is replaced by the shadow's; one that does not parse is black.
     * Left out, `SHADOW_CASTER_DEFAULTS.color`.
     * @returns A `drop-shadow` filter value.
     */
    export const computeShadowFilter = (shadow: number[], color: string | undefined) => {
        const [x, y, blurPx, alpha] = shadow;
        const parsed = Color.parse(color ?? SHADOW_CASTER_DEFAULTS.color) ?? FALLBACK_COLOR;
        const css = Color.RGBA.toCss(Color.HSVA.toRgba({ ...parsed, a: alpha }));

        return `drop-shadow(${x}px ${y}px ${blurPx}px ${css})`;
    };

    /**
     * Where the pointer is across an element, held inside it.
     *
     * @param reading Where the pointer is relative to the element.
     * @returns `0` to `1` on each axis.
     */
    export const getBoxRatio = (reading: PointerReading): Point2d => ({
        x: MathUtils.clamp01(reading.boxRatio.x),
        y: MathUtils.clamp01(reading.boxRatio.y),
    });

    /**
     * How far `Tilter`'s surface should lean, before easing.
     *
     * @param boxRatio Where the pointer is across the surface, from {@link getBoxRatio}.
     * @param strength How strongly the surface answers, from {@link computeEdgeStrength}, or `0` at rest.
     * @returns `[x, y, strength]`: the pointer's offset from the middle on each axis, scaled by the strength, then
     * the strength itself — the list a smoother follows.
     */
    export const computeLeanTargets = (boxRatio: Point2d, strength: number): number[] => [
        (boxRatio.x - CENTER) * strength,
        (boxRatio.y - CENTER) * strength,
        strength,
    ];

    /**
     * What `Tilter` draws from an eased lean.
     *
     * @param lean `[x, y, strength]`, as {@link computeLeanTargets} returns them and after easing.
     * @param boxRatio Where the pointer actually is, which is not eased.
     * @param maxTiltDegrees How far the surface turns at the very edge.
     * @param isResting Whether the surface is at rest.
     * @returns The turn, the sheen's place and the rest of the state handed to `renderSheen`.
     */
    export const computeTilterState = (
        lean: number[],
        boxRatio: Point2d,
        maxTiltDegrees: number,
        isResting: boolean,
    ): TilterState => {
        const [x, y, strength] = lean;

        return {
            tilt: { x: y * FULL_SWING * -maxTiltDegrees, y: x * FULL_SWING * maxTiltDegrees },
            boxRatio,
            sheenPosition: MathUtils.clamp01(CENTER - (x + y) * CENTER * SHEEN_OVERTRAVEL) * PERCENT,
            strength,
            isResting,
        };
    };

    /**
     * The transform `Tilter` writes on its surface.
     *
     * @param tilt The turn, from {@link computeTilterState}.
     * @returns A `transform` value.
     */
    export const getTiltTransform = (tilt: Point2d) => `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`;
}
