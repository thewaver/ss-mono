import type { AccessorProps } from "../../../Utils/typeUtils";

export type LightCatcherProps = AccessorProps<{
    /**
     * How near the pointer has to be before the surface answers it at all, in pixels from its center.
     *
     * Left out, it answers a pointer anywhere on the page. Set, the surface sits at its resting brightness and
     * lightness until the pointer comes inside the range, which is what stops a page full of these from all lifting at
     * once as the pointer crosses it.
     */
    activeRangePx?: number;
    /**
     * How far from the surface's center the light reaches, in pixels.
     *
     * The surface is at its brightest with the pointer on it and fades back to resting as the pointer walks
     * out to this distance. The fade runs from the surface's edge rather than from its center, the way
     * `Tilter`'s does, so a wide surface and a narrow one both reach full brightness where they are actually
     * pointed at.
     */
    lightRangePx?: number;
    /** How bright the surface is with the pointer on it, as a multiplier — `1` is untouched. */
    maxBrightness?: number;
    /**
     * How bright the surface is with the pointer out of reach, turned off, or absent from the page.
     *
     * It defaults to `1`, which is the content exactly as the consumer painted it. Dropping it below `1` dims
     * everything that is not being pointed at, which is what turns a row of these into a spotlight.
     */
    restingBrightness?: number;
    /**
     * How far the surface is faded toward white with the pointer on it, from `0`, untouched, to `1`, white.
     *
     * Where brightness scales every color up, so black stays black and bright colors wash out, lightness lifts
     * the dark parts most, so a dark surface looks lit from the front rather than glowing. The two stack, and
     * either one left untouched at both ends is simply not applied — there is no switch between them.
     */
    maxLightness?: number;
    /**
     * How far the surface is faded toward white with the pointer out of reach, turned off, or absent from the
     * page.
     *
     * It defaults to `0`, the content exactly as the consumer painted it.
     */
    restingLightness?: number;
    /**
     * Stops the surface answering the pointer, leaving it at its resting brightness and lightness.
     *
     * It is what a consumer honoring a reduced-motion preference passes, since the library never reads that
     * preference itself — only the consumer knows whether a brightening surface is motion worth suppressing.
     */
    isDisabled?: boolean;
}>;
