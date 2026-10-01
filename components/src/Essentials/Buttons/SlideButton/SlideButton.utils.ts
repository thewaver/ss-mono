import { MathUtils, StoreUtils } from "@thewaver/ss-utils";

import type { InteractionDragEndReason } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { SlideButtonGestureDefs, SlideButtonGestureState, SlideButtonPress } from "./SlideButton.types";

/** The start of the track. */
const RATIO_MIN = 0;
/** The end of the track. */
const RATIO_MAX = 1;
/** How far a press on the thumb has to travel before it is a drag rather than a wobble, in pixels. */
const DRAG_THRESHOLD_PX = 4;
/** The keys a hold answers to, which are the keys that press a button. */
const HOLD_KEYS = ["Enter", " "];

/** Where the thumb's leading edge sits for a given progress. The thumb's own width is not travel, so the progress is scaled by what is left. */
const computeThumbStart = (progressRatio: number, thumbRatio: number) => progressRatio * (RATIO_MAX - thumbRatio);

/**
 * The arithmetic behind a slide-to-confirm button.
 *
 * Everything is a fraction of the track rather than a pixel measurement, so the same numbers work
 * at any width. The one thing to keep in mind is that the thumb occupies part of the track, so full
 * progress is the thumb reaching the far end rather than traveling the track's whole length.
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
     * rather than jumping to center itself under it.
     *
     * @param pointerRatio The pointer's position along the track.
     * @param progressRatio How far the thumb has traveled.
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
     * @param progressRatio How far the thumb has traveled.
     * @param thumbRatio The thumb's width as a fraction of the track.
     */
    export const computeIsOnThumb = (pointerRatio: number, progressRatio: number, thumbRatio: number) => {
        const grabRatio = computeGrabRatio(pointerRatio, progressRatio, thumbRatio);

        return grabRatio >= RATIO_MIN && grabRatio <= thumbRatio;
    };

    /**
     * How far the thumb has traveled, from the pointer's position.
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

    /**
     * Runs a slide button's two routes to its action: carrying the thumb to the end of the track, and holding the
     * button down until the hold fills.
     *
     * A press is judged once, where it lands. Under every mode but `"hold"` a press on the thumb that then travels
     * past a few pixels picks the thumb up, and the thumb follows the pointer from the point it was grabbed; letting
     * go at the end of the track activates, and letting go anywhere else, or the system cancelling the gesture,
     * puts it back. Under every mode but `"slide"` a press also starts a hold, which fills over the hold duration and
     * activates when it is full — and a grab cancels it, since the two cannot both be the gesture. A held Enter or
     * Space runs the same hold under every mode, so no setting can leave the button without a keyboard route. The
     * progress either route makes is written through `setProgressRatio`, and put back to nothing when the gesture
     * ends.
     *
     * The store says whether a hold is running and whether the thumb has been picked up. The functions in `defs` are
     * read when they are needed, so they may answer differently over time; `getProgressRatio` is read at release to
     * decide whether the thumb reached the end, so it has to answer with what `setProgressRatio` last wrote.
     *
     * @param defs How to read the button and write its progress.
     * @returns The store, and the commands to feed it: `drag` and `dragEnd` from a drag tracker over the track,
     * `pressKey` and `releaseKey` from the button's key events, `stopHold` for focus leaving or the owner going
     * away, and `reset` for the button becoming disabled, which drops everything under way.
     */
    export const createGesture = (defs: SlideButtonGestureDefs) => {
        const store = StoreUtils.create<SlideButtonGestureState>(
            { isHolding: false, isGrabbed: false },
            { isEqual: StoreUtils.getIsShallowEqual },
        );

        let holdFrame: number | undefined;
        let press: SlideButtonPress | undefined;
        let grabRatio: number | undefined;

        const setGrabRatio = (ratio: number | undefined) => {
            grabRatio = ratio;

            store.update((current) => ({ ...current, isGrabbed: ratio !== undefined }));
        };

        const getThumbRatio = () => computeWidthRatio(defs.getTrackWidth(), defs.getThumbSize());

        const stopHold = () => {
            if (holdFrame !== undefined) cancelAnimationFrame(holdFrame);

            holdFrame = undefined;

            if (!store.get().isHolding) return;

            store.update((current) => ({ ...current, isHolding: false }));
            defs.setProgressRatio(RATIO_MIN);
        };

        const startHold = () => {
            if (store.get().isHolding || grabRatio !== undefined) return;

            const startedAtMs = performance.now();

            const step = () => {
                const ratio = computeHoldRatio(performance.now() - startedAtMs, defs.getHoldDurationMs());

                defs.setProgressRatio(ratio);

                if (ratio < RATIO_MAX) {
                    holdFrame = requestAnimationFrame(step);

                    return;
                }

                holdFrame = undefined;

                defs.onActivate();
            };

            store.update((current) => ({ ...current, isHolding: true }));
            step();
        };

        const drag = (pointerRatio: number) => {
            const thumbRatio = getThumbRatio();
            const mode = defs.getMode();

            if (!press) {
                press = {
                    ratio: pointerRatio,
                    isOnThumb: computeIsOnThumb(pointerRatio, defs.getProgressRatio(), thumbRatio),
                };

                if (mode !== "slide") startHold();

                return;
            }

            if (grabRatio !== undefined) {
                defs.setProgressRatio(computeProgressRatio(pointerRatio, grabRatio, thumbRatio));

                return;
            }

            if (mode === "hold" || !press.isOnThumb) return;
            if (Math.abs(pointerRatio - press.ratio) < computeWidthRatio(defs.getTrackWidth(), DRAG_THRESHOLD_PX))
                return;

            const nextGrabRatio = computeGrabRatio(press.ratio, RATIO_MIN, thumbRatio);

            stopHold();
            setGrabRatio(nextGrabRatio);
            defs.setProgressRatio(computeProgressRatio(pointerRatio, nextGrabRatio, thumbRatio));
        };

        const dragEnd = (reason: InteractionDragEndReason) => {
            const wasGrabbed = grabRatio !== undefined;

            stopHold();
            press = undefined;

            if (!wasGrabbed) return;

            if (reason === "release" && defs.getProgressRatio() >= RATIO_MAX) defs.onActivate();

            setGrabRatio(undefined);
            defs.setProgressRatio(RATIO_MIN);
        };

        return {
            get: store.get,
            subscribe: store.subscribe,
            drag,
            dragEnd,
            stopHold,
            pressKey: (key: string, isRepeat: boolean) => {
                if (isRepeat || !HOLD_KEYS.includes(key)) return;

                startHold();
            },
            releaseKey: (key: string) => {
                if (!HOLD_KEYS.includes(key)) return;

                stopHold();
            },
            reset: () => {
                stopHold();
                press = undefined;
                setGrabRatio(undefined);
                defs.setProgressRatio(RATIO_MIN);
            },
        };
    };
}
