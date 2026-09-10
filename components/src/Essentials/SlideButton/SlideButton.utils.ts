import { MathUtils } from "@thewaver/ss-utils";

/** The start of the track. */
const RATIO_MIN = 0;
/** The end of the track. */
const RATIO_MAX = 1;

/** Where the thumb's leading edge sits for a given progress. The thumb's own width is not travel, so the progress is scaled by what is left. */
const computeThumbStart = (progressRatio: number, thumbRatio: number) => progressRatio * (RATIO_MAX - thumbRatio);

/**
 * The arithmetic behind a slide-to-confirm button.
 *
 * Everything is a fraction of the track rather than a pixel measurement, so the same numbers work
 * at any width. The one thing to keep in mind is that the thumb occupies part of the track, so full
 * progress is the thumb reaching the far end rather than travelling the track's whole length.
 */
export namespace SlideButtonUtils {
    /**
     * A pixel width as a fraction of the track.
     *
     * @param trackWidth The track's width in pixels.
     * @param widthPx The width to convert.
     * @returns The fraction, capped at the whole track. A track of no width reports `1`, which stops
     * anything dividing by it.
     */
    export const computeWidthRatio = (trackWidth: number, widthPx: number) =>
        trackWidth > 0 ? Math.min(widthPx / trackWidth, RATIO_MAX) : RATIO_MAX;

    /**
     * Where along the thumb the user took hold of it.
     *
     * Kept for the rest of the drag so the thumb follows the pointer from the point it was grabbed,
     * rather than jumping to centre itself under it.
     *
     * @param pointerRatio The pointer's position along the track.
     * @param progressRatio How far the thumb has travelled.
     * @param thumbRatio The thumb's width as a fraction of the track.
     * @returns The offset from the thumb's leading edge. Negative or past the thumb's width means the
     * pointer is not on the thumb.
     */
    export const computeGrabRatio = (pointerRatio: number, progressRatio: number, thumbRatio: number) =>
        pointerRatio - computeThumbStart(progressRatio, thumbRatio);

    /**
     * Whether a press landed on the thumb rather than on the track beside it.
     *
     * @param pointerRatio The pointer's position along the track.
     * @param progressRatio How far the thumb has travelled.
     * @param thumbRatio The thumb's width as a fraction of the track.
     */
    export const computeIsOnThumb = (pointerRatio: number, progressRatio: number, thumbRatio: number) => {
        const grabRatio = computeGrabRatio(pointerRatio, progressRatio, thumbRatio);

        return grabRatio >= RATIO_MIN && grabRatio <= thumbRatio;
    };

    /**
     * How far the thumb has travelled, from the pointer's position.
     *
     * @param pointerRatio The pointer's position along the track.
     * @param grabRatio Where along the thumb it was grabbed, from
     * {@link SlideButtonUtils.computeGrabRatio}.
     * @param thumbRatio The thumb's width as a fraction of the track.
     * @returns The progress from `0` to `1`. A thumb as wide as its track has nowhere to travel and
     * reports `0`.
     */
    export const computeProgressRatio = (pointerRatio: number, grabRatio: number, thumbRatio: number) => {
        const travelRatio = RATIO_MAX - thumbRatio;

        if (travelRatio <= 0) return RATIO_MIN;

        return MathUtils.clamp01((pointerRatio - grabRatio) / travelRatio);
    };

    /**
     * How far through a press-and-hold the user is.
     *
     * @param elapsedMs How long the press has lasted.
     * @param durationMs How long a complete hold takes. Zero or less reports `1` at once, which is what
     * turns the control into an ordinary button.
     * @returns The progress from `0` to `1`.
     */
    export const computeHoldRatio = (elapsedMs: number, durationMs: number) => {
        if (durationMs <= 0) return RATIO_MAX;

        return MathUtils.clamp01(elapsedMs / durationMs);
    };
}
