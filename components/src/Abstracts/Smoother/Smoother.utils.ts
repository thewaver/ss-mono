import { StoreUtils } from "@thewaver/ss-utils";

import type { SmootherFollower } from "./Smoother.types";

/** How near a value has to be to its target before it is put there and the frames stop. */
const SETTLED_EPSILON = 0.001;

/** Whether every value has come close enough to its target to stop. */
const getIsSettled = (values: number[], targets: number[]) =>
    values.every((value, index) => Math.abs(value - targets[index]) < SETTLED_EPSILON);

/**
 * Makes a set of numbers trail behind the values they are driven by, rather than jumping to them.
 *
 * The easing is exponential and measured in time rather than in frames, so a value covers the same share of the
 * way in the same number of milliseconds on a 60Hz screen, a 144Hz one, or a busy tab dropping frames.
 */
export namespace SmootherUtils {
    /**
     * Moves one value part of the way towards its target, for the time that has passed.
     *
     * After `smoothingMs` a value has closed about 63% of the gap, after twice that about 86%, and so on — the
     * gap shrinks by the same share in every equal stretch of time, whatever the frame rate that time was cut into.
     *
     * @param current Where the value is now.
     * @param target Where it is heading.
     * @param elapsedMs How long has passed since `current` was taken. A negative time is treated as none.
     * @param smoothingMs How slowly it follows. `0` or less lands on the target at once.
     * @returns The value after `elapsedMs`, never past the target.
     */
    export const getStep = (current: number, target: number, elapsedMs: number, smoothingMs: number): number => {
        if (smoothingMs <= 0) return target;

        return current + (target - current) * (1 - Math.exp(-Math.max(0, elapsedMs) / smoothingMs));
    };

    /**
     * Follows a list of numbers, easing towards each change on animation frames.
     *
     * The follower is a store of the trailing values, starting on `initialTargets`. `follow` hands it new targets
     * and a smoothing time; frames are asked for only while something is still moving, so a still pointer costs
     * nothing. A change to the number of values, a change too small to be seen, or a smoothing time of `0` or less
     * puts every value on its target at once. `stop` calls off the frame being waited for and leaves the values
     * where they are; the next `follow` carries on from there.
     *
     * @param initialTargets Where the values start.
     * @returns The follower.
     */
    export const create = (initialTargets: number[]): SmootherFollower => {
        const store = StoreUtils.create(initialTargets);

        let targets = initialTargets;
        let smoothingMs = 0;
        let frameId: ReturnType<typeof requestAnimationFrame> | undefined;
        let lastMs = 0;

        const stop = () => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);

            frameId = undefined;
        };

        const advance = (nowMs: number) => {
            frameId = undefined;

            const elapsedMs = nowMs - lastMs;
            const values = store.get();

            lastMs = nowMs;

            const next = targets.map((target, index) => getStep(values[index], target, elapsedMs, smoothingMs));

            if (getIsSettled(next, targets)) {
                store.set(targets);

                return;
            }

            store.set(next);
            frameId = requestAnimationFrame(advance);
        };

        const follow = (nextTargets: number[], nextSmoothingMs: number) => {
            const values = store.get();

            targets = nextTargets;
            smoothingMs = nextSmoothingMs;

            if (smoothingMs <= 0 || values.length !== targets.length || getIsSettled(values, targets)) {
                stop();
                store.set(targets);

                return;
            }

            if (frameId !== undefined) return;

            lastMs = performance.now();
            frameId = requestAnimationFrame(advance);
        };

        return { get: store.get, subscribe: store.subscribe, follow, stop };
    };
}
