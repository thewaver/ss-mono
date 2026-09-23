import { type Accessor, createEffect, createSignal, onCleanup, untrack } from "solid-js";

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
     * Frames are asked for only while something is still moving, so a still pointer costs nothing. A change to the
     * number of values, a change too small to be seen, or a smoothing time of `0` or less puts every value on its
     * target at once.
     *
     * @param getTargets The values to follow, read reactively.
     * @param getSmoothingMs How slowly they are followed, as {@link getStep} takes it.
     * @returns The trailing values, one per target, in the same order.
     */
    export const create = (getTargets: Accessor<number[]>, getSmoothingMs: Accessor<number>): Accessor<number[]> => {
        const [getValues, setValues] = createSignal(untrack(getTargets));

        let frameId: ReturnType<typeof requestAnimationFrame> | undefined;
        let lastMs = 0;

        const stop = () => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);

            frameId = undefined;
        };

        const advance = (nowMs: number) => {
            frameId = undefined;

            const targets = untrack(getTargets);
            const smoothingMs = untrack(getSmoothingMs);
            const elapsedMs = nowMs - lastMs;
            const values = untrack(getValues);

            lastMs = nowMs;

            const next = targets.map((target, index) => getStep(values[index], target, elapsedMs, smoothingMs));

            if (getIsSettled(next, targets)) {
                setValues(targets);

                return;
            }

            setValues(next);
            frameId = requestAnimationFrame(advance);
        };

        createEffect(() => {
            const targets = getTargets();
            const smoothingMs = getSmoothingMs();
            const values = untrack(getValues);

            if (smoothingMs <= 0 || values.length !== targets.length || getIsSettled(values, targets)) {
                stop();
                setValues(targets);

                return;
            }

            if (frameId !== undefined) return;

            lastMs = performance.now();
            frameId = requestAnimationFrame(advance);
        });

        onCleanup(stop);

        return getValues;
    };
}
