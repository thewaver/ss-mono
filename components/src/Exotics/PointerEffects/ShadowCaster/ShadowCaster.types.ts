import type { AccessorProps } from "../../../Utils/typeUtils";

export type ShadowCasterProps = AccessorProps<{
    /**
     * How near the pointer has to be before the shadow answers it at all, in pixels from the content's center.
     *
     * Left out, it answers a pointer anywhere on the page, which is what a single thing on a quiet page wants.
     * Set, the shadow rests until the pointer comes inside the range and rests again once it leaves — which is
     * what a page full of these wants, so that moving the pointer across it does not stir everything at once.
     * It is measured the same way as {@link ShadowCasterProps.lightRangePx}, from the center rather than from
     * the edge, so the two numbers can be compared.
     */
    activeRangePx?: number;
    /**
     * How far the pointer's light reaches, in pixels, measured from the content's center.
     *
     * At the content it is at its shortest and darkest; at this distance and beyond it has reached its longest
     * and faintest. It is a distance rather than a ratio so that two things of different sizes standing beside
     * each other are lit the same way.
     */
    lightRangePx?: number;
    /** How far the shadow is thrown when the pointer is on the content itself. */
    minThrowPx?: number;
    /** How far the shadow is thrown once the pointer is out at `lightRangePx`. */
    maxThrowPx?: number;
    /** How far the shadow is thrown, straight down, while nothing is pointing at the content. */
    restingThrowPx?: number;
    /** How soft the shadow is with the pointer on the content. */
    minBlurPx?: number;
    /** How soft the shadow is once the pointer is out at `lightRangePx`. */
    maxBlurPx?: number;
    /** How soft the resting shadow is. */
    restingBlurPx?: number;
    /** How dark the shadow is with the pointer on the content, `0` to `1`. */
    maxOpacity?: number;
    /**
     * How dark the shadow is once the pointer is out at `lightRangePx`.
     *
     * It defaults to nothing at all, which is the honest end of the metaphor: the pointer is the light, so a
     * pointer out of range casts no shadow rather than a faint one. Raise it for a surface that should keep
     * some weight whatever the pointer is doing.
     */
    minOpacity?: number;
    /**
     * How dark the shadow is while it is resting — no pointer on the page, none inside `activeRangePx`, or
     * turned off.
     *
     * It is separate from `minOpacity` because the two states only look alike: fading to nothing as the
     * pointer walks away is the effect doing its job, and a page that never had a pointer, or has suppressed
     * the effect for reduced motion, still wants its content to sit on something.
     */
    restingOpacity?: number;
    /**
     * The shadow's color. Any CSS color is taken; whatever alpha it carries is replaced by the opacity worked
     * out from the distance, so the color says what the shadow is made of and the range says how dark it is.
     */
    color?: string;
    /**
     * Stops the shadow following the pointer, leaving it at rest.
     *
     * It is what a consumer honoring a reduced-motion preference passes, since the library never reads that
     * preference itself — only the consumer knows whether a shadow that moves is motion worth suppressing.
     */
    isDisabled?: boolean;
}>;
