import { MathUtils } from "@thewaver/ss-utils";

import type { TurnClockTargetRequest, TurnClockTween } from "./TurnClock.types";

/** A backstop timer's grace period. A background tab stops delivering frames, and a turn that never finished would leave the component stuck mid-animation. */
const FRAME_STARVATION_SLACK_MS = 100;

/** Does nothing, for a command that had nothing to start and so nothing to stop. */
const NO_CANCEL = () => {};

/**
 * The timing every turning thing shares, whatever it turns: a timed turn that still lands when the tab stops painting,
 * a turn that runs for as long as it is wanted, the rest after a landing, and a target that may be chosen later.
 *
 * `RotatorUtils` turns one angle with it and `RollerUtils` one rotation in three dimensions; neither knows the other.
 */
export namespace TurnClockUtils {
    /**
     * A timed turn run on animation frames, with a timer beside it that lands the turn anyway once the duration and a
     * little more have passed.
     *
     * A page that is not painting — a background tab, a throttled window — hands out no frames, so a turn driven by
     * frames alone would stop part-way and never report that it ended. Whichever of a frame or the timer gets there
     * first ends the turn, and the other is called off.
     *
     * @returns The tween. One tween runs one turn at a time; starting another abandons the first.
     */
    export const createTween = (): TurnClockTween => {
        let frameId: number | undefined;
        let starvationHandle: ReturnType<typeof setTimeout> | undefined;

        const cancel = () => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);
            if (starvationHandle !== undefined) clearTimeout(starvationHandle);

            frameId = undefined;
            starvationHandle = undefined;
        };

        const run = (durationMs: number, onFrame: (ratio: number) => void, onArrive: () => void) => {
            cancel();

            const arrive = () => {
                cancel();
                onArrive();
            };

            if (durationMs <= 0) {
                arrive();

                return;
            }

            const startedAt = performance.now();

            const advance = () => {
                const ratio = MathUtils.clamp01((performance.now() - startedAt) / durationMs);

                if (ratio >= 1) {
                    arrive();

                    return;
                }

                onFrame(ratio);

                frameId = requestAnimationFrame(advance);
            };

            starvationHandle = setTimeout(arrive, durationMs + FRAME_STARVATION_SLACK_MS);
            frameId = requestAnimationFrame(advance);
        };

        return { run, cancel };
    };

    /**
     * Calls `onFrame` on every animation frame with the time since the one before, until the returned function is
     * called.
     *
     * It has no backstop timer, on purpose: it is for a turn that owes nobody an answer, such as idle drift, which
     * simply stops while the tab is not painting.
     *
     * @param onFrame Called with the milliseconds since the previous frame, or since the loop started for the first.
     * @returns The function that stops the loop. It may be called from inside `onFrame`.
     */
    export const runFrames = (onFrame: (elapsedMs: number) => void) => {
        let previousTime = performance.now();
        let frameId: number;
        let isRunning = true;

        const advance = (time: number) => {
            const elapsedMs = time - previousTime;

            previousTime = time;

            onFrame(elapsedMs);

            if (isRunning) frameId = requestAnimationFrame(advance);
        };

        frameId = requestAnimationFrame(advance);

        return () => {
            isRunning = false;
            cancelAnimationFrame(frameId);
        };
    };

    /**
     * Holds a rest after a landing and calls `onEnd` when it is over.
     *
     * @param restDurationMs How long the rest lasts. Below `0` it lasts for good and `onEnd` is never called.
     * @param onEnd Called once the rest is over.
     * @returns The function that calls the rest off without ending it.
     */
    export const holdRest = (restDurationMs: number, onEnd: () => void) => {
        if (restDurationMs < 0) return NO_CANCEL;

        const handle = setTimeout(onEnd, restDurationMs);

        return () => clearTimeout(handle);
    };

    /**
     * Asks for targets that may arrive later, and ignores the answer to any request canceled before it came.
     *
     * @returns The request.
     */
    export const createTargetRequest = (): TurnClockTargetRequest => {
        let generation = 0;

        const request = <T>(compute: () => T | Promise<T>, onTarget: (target: T) => void, onRefused: () => void) => {
            const current = generation;

            void Promise.resolve(compute())
                .then((target) => {
                    if (current !== generation) return;

                    onTarget(target);
                })
                .catch(() => {
                    if (current !== generation) return;

                    onRefused();
                });
        };

        const cancel = () => {
            generation++;
        };

        return { request, cancel };
    };

    /**
     * Whether a turning thing at a standstill should be turning by itself.
     *
     * @param opts.idleDelayMs How long one step of idle drift takes. `undefined` means no drift.
     * @param opts.isIdleAllowed Whether drift is allowed at all — switched on, and the tab in the foreground.
     * @param opts.isResting Whether the rest after a landing is still running.
     * @param opts.isRotatable Whether the thing can turn at all.
     * @returns `true` only when every one of those allows it.
     */
    export const getIsIdling = (opts: {
        idleDelayMs: number | undefined;
        isIdleAllowed: boolean;
        isResting: boolean;
        isRotatable: boolean;
    }) => opts.idleDelayMs !== undefined && opts.isIdleAllowed && !opts.isResting && opts.isRotatable;
}
