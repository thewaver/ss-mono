import { MathUtils, type Size2d, StoreUtils } from "@thewaver/ss-utils";

import type {
    InteractionDragEndReason,
    InteractionDragRatio,
} from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import type {
    SlideButtonGestureDefs,
    SlideButtonGestureState,
    SlideButtonOrientation,
    SlideButtonPress,
} from "./SlideButton.types";

/** The start of the track. */
const RATIO_MIN = 0;
/** The end of the track. */
const RATIO_MAX = 1;
/** The least progress a release may ask for before it completes the slide, so a thumb barely moved never does. */
const COMPLETION_RATIO_MIN = 0.1;
/** How far a press on the thumb has to travel before it is a drag rather than a wobble, in pixels. */
const DRAG_THRESHOLD_PX = 4;
/** The keys a hold answers to, which are the keys that press a button. */
const HOLD_KEYS = ["Enter", " "];

/** Where the thumb's edge facing the start of the track sits for a given progress. The thumb's own length is not travel, so the progress is scaled by what is left. */
const computeThumbStart = (progressRatio: number, thumbRatio: number) => progressRatio * (RATIO_MAX - thumbRatio);

/**
 * The arithmetic behind a slide-to-confirm button.
 *
 * Everything is a fraction of the track rather than a pixel measurement, so the same numbers work
 * at any length and along either axis. The one thing to keep in mind is that the thumb occupies part of the track,
 * so full progress is the thumb reaching the far end rather than traveling the track's whole length.
 */
export namespace SlideButtonUtils {
    /**
     * How long the track is along the axis the thumb travels.
     *
     * @param trackSize The track's size in pixels.
     * @param orientation Which way the track runs.
     * @returns The width of a horizontal track, the height of a vertical one.
     */
    export const computeTrackLength = (trackSize: Size2d, orientation: SlideButtonOrientation) =>
        orientation === "vertical" ? trackSize.height : trackSize.width;

    /**
     * Where a pointer sits along the track, from where it sits across the track's box.
     *
     * A horizontal track counts from the edge its text starts on — the left, or the right under `"rtl"` — and a
     * vertical one from its bottom edge whatever the text, so on either axis `0` is where the thumb rests and `1` is
     * where the slide ends.
     *
     * @param dragRatio The pointer's position across the track's box, as a drag tracker reports it, counted from the
     * left and from the top.
     * @param orientation Which way the track runs.
     * @param direction Which way text runs around the track.
     * @returns The position along the track, from `0` to `1`.
     */
    export const computePointerRatio = (
        dragRatio: InteractionDragRatio,
        orientation: SlideButtonOrientation,
        direction: NavigatorDirection,
    ) => {
        if (orientation === "vertical") return RATIO_MAX - dragRatio.y;

        return direction === "rtl" ? RATIO_MAX - dragRatio.x : dragRatio.x;
    };

    /**
     * A pixel length along the track as a fraction of the track.
     *
     * @param trackLength The track's length in pixels, from {@link SlideButtonUtils.computeTrackLength}.
     * @param lengthPx The length to convert.
     * @returns The fraction, capped at the whole track. A track of no length reports `1`, which stops
     * anything dividing by it.
     */
    export const computeLengthRatio = (trackLength: number, lengthPx: number) =>
        trackLength > 0 ? Math.min(lengthPx / trackLength, RATIO_MAX) : RATIO_MAX;

    /**
     * Where along the thumb the user took hold of it.
     *
     * Kept for the rest of the drag so the thumb follows the pointer from the point it was grabbed,
     * rather than jumping to center itself under it.
     *
     * @param pointerRatio The pointer's position along the track.
     * @param progressRatio How far the thumb has traveled.
     * @param thumbRatio The thumb's length as a fraction of the track.
     * @returns The offset from the thumb's edge facing the start of the track. Negative or past the thumb's
     * length means the pointer is not on the thumb.
     */
    export const computeGrabRatio = (pointerRatio: number, progressRatio: number, thumbRatio: number) =>
        pointerRatio - computeThumbStart(progressRatio, thumbRatio);

    /**
     * Whether a press landed on the thumb rather than on the track beside it.
     *
     * @param pointerRatio The pointer's position along the track.
     * @param progressRatio How far the thumb has traveled.
     * @param thumbRatio The thumb's length as a fraction of the track.
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
     * @param thumbRatio The thumb's length as a fraction of the track.
     * @returns The progress from `0` to `1`. A thumb as wide as its track has nowhere to travel and
     * reports `0`.
     */
    export const computeProgressRatio = (pointerRatio: number, grabRatio: number, thumbRatio: number) => {
        const travelRatio = RATIO_MAX - thumbRatio;

        if (travelRatio <= 0) return RATIO_MIN;

        return MathUtils.clamp01((pointerRatio - grabRatio) / travelRatio);
    };

    /**
     * How far along the track a released thumb has to be for the slide to complete.
     *
     * @param completionRatio The share the consumer asked for.
     * @returns That share, held between a tenth of the track and the whole of it. Asking for more than the track
     * has is the same as asking for its end.
     */
    export const computeCompletionRatio = (completionRatio: number) =>
        MathUtils.clamp(completionRatio, COMPLETION_RATIO_MIN, RATIO_MAX);

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
     * Every position is measured along the axis `getOrientation` names: a horizontal thumb travels away from the edge
     * the text starts on, which `getDirection` says, and a vertical one upward. A press is judged once, where it lands. Under every mode but `"hold"` a press on the thumb that then travels
     * past a few pixels picks the thumb up, and the thumb follows the pointer from the point it was grabbed; letting
     * go at the completion ratio along the track, the end by default, activates, and letting go anywhere short of it, or the system cancelling the gesture,
     * puts it back. Under every mode but `"slide"` a press also starts a hold, which fills over the hold duration and
     * activates when it is full — and a grab cancels it, since the two cannot both be the gesture. A held Enter or
     * Space runs the same hold under every mode, so no setting can leave the button without a keyboard route. The
     * progress either route makes is written through `setProgressRatio`, and put back to nothing when the gesture
     * ends.
     *
     * A click is the third route, and it is not a tap. Assistive technology activates a button by sending it a click
     * with nothing before it — NVDA and JAWS swallow Enter and Space in their reading mode and send the click instead
     * — so a click that arrives with no press under way activates at once. Every click a real press produces is
     * ignored: a pointer landing on the button or Enter or Space going down marks the button pressed, and the mark
     * is lifted only after the press has ended and its own click has been delivered, so a tap, an abandoned slide
     * and a key held for a moment all stay what they were.
     *
     * The store says whether a hold is running and whether the thumb has been picked up. The functions in `defs` are
     * read when they are needed, so they may answer differently over time; `getProgressRatio` is read at release to
     * decide whether the thumb reached the completion ratio, so it has to answer with what `setProgressRatio` last wrote.
     *
     * @param defs How to read the button and write its progress.
     * @returns The store, and the commands to feed it: `drag` and `dragEnd` from a drag tracker over the track, `drag`
     * taking the tracker's ratio on both axes as it comes, `pressKey` and `releaseKey` from the button's key events,
     * `click` from its click event, `stopHold` for focus leaving or the owner going away, and `reset` for the button
     * becoming disabled, which drops everything under way.
     */
    export const createGesture = (defs: SlideButtonGestureDefs) => {
        const store = StoreUtils.create<SlideButtonGestureState>(
            { isHolding: false, isGrabbed: false },
            { isEqual: StoreUtils.getIsShallowEqual },
        );

        let holdFrame: number | undefined;
        let press: SlideButtonPress | undefined;
        let grabRatio: number | undefined;
        let isPressed = false;

        const releasePress = () => {
            setTimeout(() => {
                isPressed = false;
            });
        };

        const setGrabRatio = (ratio: number | undefined) => {
            grabRatio = ratio;

            store.update((current) => ({ ...current, isGrabbed: ratio !== undefined }));
        };

        const getTrackLength = () => computeTrackLength(defs.getTrackSize(), defs.getOrientation());

        const getThumbRatio = () => computeLengthRatio(getTrackLength(), defs.getThumbSize());

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

        const drag = (dragRatio: InteractionDragRatio) => {
            const pointerRatio = computePointerRatio(dragRatio, defs.getOrientation(), defs.getDirection());
            const thumbRatio = getThumbRatio();
            const mode = defs.getMode();

            if (!press) {
                isPressed = true;
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
            if (Math.abs(pointerRatio - press.ratio) < computeLengthRatio(getTrackLength(), DRAG_THRESHOLD_PX)) return;

            const nextGrabRatio = computeGrabRatio(press.ratio, RATIO_MIN, thumbRatio);

            stopHold();
            setGrabRatio(nextGrabRatio);
            defs.setProgressRatio(computeProgressRatio(pointerRatio, nextGrabRatio, thumbRatio));
        };

        const dragEnd = (reason: InteractionDragEndReason) => {
            const wasGrabbed = grabRatio !== undefined;

            stopHold();
            releasePress();
            press = undefined;

            if (!wasGrabbed) return;

            if (reason === "release" && defs.getProgressRatio() >= computeCompletionRatio(defs.getCompletionRatio()))
                defs.onActivate();

            setGrabRatio(undefined);
            defs.setProgressRatio(RATIO_MIN);
        };

        return {
            get: store.get,
            subscribe: store.subscribe,
            drag,
            dragEnd,
            stopHold: () => {
                stopHold();
                releasePress();
            },
            pressKey: (key: string, isRepeat: boolean) => {
                if (!HOLD_KEYS.includes(key)) return;

                isPressed = true;

                if (isRepeat) return;

                startHold();
            },
            releaseKey: (key: string) => {
                if (!HOLD_KEYS.includes(key)) return;

                stopHold();
                releasePress();
            },
            click: () => {
                if (isPressed) return;

                defs.onActivate();
            },
            reset: () => {
                stopHold();
                releasePress();
                press = undefined;
                setGrabRatio(undefined);
                defs.setProgressRatio(RATIO_MIN);
            },
        };
    };
}
