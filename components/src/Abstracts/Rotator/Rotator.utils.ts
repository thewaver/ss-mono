import type { Accessor } from "solid-js";
import { createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import type { EasingFn } from "@thewaver/ss-utils";
import { EasingUtils, MathUtils, RotationUtils } from "@thewaver/ss-utils";

import { access } from "../../Utils/propUtils";
import { InteractionTrackerUtils } from "../InteractionTracker/InteractionTracker.utils";
import { LiveAnnouncerUtils } from "../LiveAnnouncer/LiveAnnouncer.utils";
import { SignalMirrorUtils } from "../SignalMirror/SignalMirror.utils";
import type { RotatorDefs, RotatorPhase, RotatorSpinDefs } from "./Rotator.types";

/** How long a spin takes when the caller does not say. */
const DEFAULT_SPIN_DURATION_MS = 3000;
/** How long the drift back from an overshoot takes when the caller does not say. */
const DEFAULT_SETTLE_DURATION_MS = 1500;
/** How long the wheel stays still after a spin before idling resumes. */
const DEFAULT_REST_DURATION_MS = 3000;
/** Three whole turns and no overshoot, when the caller does not say. */
const DEFAULT_SPIN_DEFS: RotatorSpinDefs = { turns: 3, jitterRatio: 0 };
/** Fewer than two steps and there is nowhere to rotate to. */
const MIN_ROTATABLE_STEP_COUNT = 2;
/** A backstop timer's grace period. A background tab stops delivering frames, and a spin that never finished would leave the component stuck mid-animation. */
const FRAME_STARVATION_SLACK_MS = 100;
/** Eases in and out, so a spin starts and stops rather than snapping to speed. */
const SPIN_EASING: EasingFn = EasingUtils.ease;

/**
 * Spins a wheel of steps to a chosen one and reports where it is throughout.
 *
 * The wheel of fortune shape: it drifts while idle, spins several turns when asked, overshoots its
 * target slightly and drifts back, then rests. What makes it more than an animation is that the
 * target can be decided asynchronously — the caller is asked for it when the spin begins, so a
 * server can pick the outcome while the wheel is already turning.
 */
export namespace RotatorUtils {
    /**
     * Drives one wheel.
     *
     * The angle is the single source of truth and the selected step is read back out of it, so whatever
     * is under the marker is what is reported, whether the wheel got there by spinning, by drifting or
     * by the consumer setting the index directly. The step that was landed on is announced, since a
     * screen reader user cannot see the wheel stop.
     *
     * Idle drift is one step per delay, and it stops on its own while the tab is in the background,
     * during the rest period after a spin, and whenever the wheel cannot rotate at all.
     *
     * @param getIsDisabled Whether the wheel may rotate.
     * @param defs.stepCount How many steps the wheel has. Fewer than two and it cannot rotate.
     * @param defs.indexSignal The selected step, if the consumer wants to control or observe it. An
     * internal signal is used when omitted.
     * @param defs.autoSpinSignal Whether idle drift is allowed. On when omitted.
     * @param defs.spinDurationMs How long a spin takes.
     * @param defs.settleDurationMs How long the drift back from an overshoot takes.
     * @param defs.restDurationMs How long the wheel stays still after landing before idling resumes.
     * @param defs.idleDelayMs How long one step of idle drift takes. Omitted means no drift.
     * @param defs.computeSpinTarget Chooses the step to land on. May return a promise, in which case
     * the wheel waits for it before starting; a rejection abandons the spin and leaves the wheel where
     * it was.
     * @param defs.computeSpinDefs How many turns to take and how far to overshoot, per target. An
     * overshoot is what makes the wheel look like it is losing momentum rather than stopping dead.
     * @param defs.computeStepLabel How to announce the step landed on. A position out of the total is
     * announced when omitted.
     * @param defs.onSpinEnd Called with the step landed on.
     * @param defs.onStepChange Called whenever the step under the marker changes, drift included.
     * @returns `getAngle` for the transform to apply, `getIndex` for the settled step, `getSelectedIndex`
     * for whatever is under the marker right now, `getPhase` — `"still"`, `"idling"`, `"spinning"` or
     * `"settling"` — `getStepAngle` and `getStepCount` for laying the steps out, `getIsRotatable`,
     * `getIsSpinnable` for enabling the button, `getIsAwaitingTarget` for the wait on an asynchronous
     * target, and `spin` to start one.
     */
    export const createRotator = (getIsDisabled: Accessor<boolean>, defs: RotatorDefs) => {
        const [getAngle, setAngle] = createSignal(0);
        const [getSpinPhase, setSpinPhase] = createSignal<Exclude<RotatorPhase, "idling">>("still");
        const [getIsAwaitingTarget, setIsAwaitingTarget] = createSignal(false);
        const [getIsResting, setIsResting] = createSignal(false);

        const [getIndex, setIndex] = SignalMirrorUtils.createOptional(() => defs.indexSignal, 0);
        const [getIsAutoSpinEnabled] = SignalMirrorUtils.createOptional(() => defs.autoSpinSignal, true);

        let targetIndex: number | undefined;
        let spinFrameId: number | undefined;
        let starvationHandle: ReturnType<typeof setTimeout> | undefined;

        const getStepCount = createMemo(() => Math.max(0, Math.trunc(access(defs.stepCount))));

        const getStepAngle = createMemo(() => RotationUtils.getStepAngle(getStepCount()));

        const getSpinDurationMs = createMemo(() => access(defs.spinDurationMs) ?? DEFAULT_SPIN_DURATION_MS);

        const getSettleDurationMs = createMemo(() => access(defs.settleDurationMs) ?? DEFAULT_SETTLE_DURATION_MS);

        const getRestDurationMs = createMemo(() => access(defs.restDurationMs) ?? DEFAULT_REST_DURATION_MS);

        const getIdleDelayMs = createMemo(() => access(defs.idleDelayMs));

        const getIsRotatable = createMemo(() => !getIsDisabled() && getStepCount() >= MIN_ROTATABLE_STEP_COUNT);

        const getIsPageHidden = InteractionTrackerUtils.trackPageHidden();

        const getIsSpinnable = createMemo(
            () => getIsRotatable() && getSpinPhase() === "still" && !getIsAwaitingTarget(),
        );

        const getPhase = createMemo((): RotatorPhase => {
            const spinPhase = getSpinPhase();

            if (spinPhase !== "still") return spinPhase;

            const isIdling =
                getIdleDelayMs() !== undefined &&
                getIsAutoSpinEnabled() &&
                !getIsResting() &&
                !getIsPageHidden() &&
                getIsRotatable();

            return isIdling ? "idling" : "still";
        });

        const getSelectedIndex = createMemo(() => RotationUtils.getAngleIndex(getAngle(), getStepCount()));

        const getStepLabel = (index: number) =>
            defs.computeStepLabel?.(index, getStepCount()) ?? `${index + 1} of ${getStepCount()}`;

        const stopSpinFrames = () => {
            if (spinFrameId !== undefined) cancelAnimationFrame(spinFrameId);
            if (starvationHandle !== undefined) clearTimeout(starvationHandle);

            spinFrameId = undefined;
            starvationHandle = undefined;
        };

        const turnTo = (toAngle: number, durationMs: number, easing: EasingFn, onArrival: () => void) => {
            stopSpinFrames();

            const fromAngle = untrack(getAngle);

            const arrive = () => {
                stopSpinFrames();
                setAngle(toAngle);
                onArrival();
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

                setAngle(MathUtils.lerp(fromAngle, toAngle, easing(ratio)));

                spinFrameId = requestAnimationFrame(advance);
            };

            starvationHandle = setTimeout(arrive, durationMs + FRAME_STARVATION_SLACK_MS);
            spinFrameId = requestAnimationFrame(advance);
        };

        const settle = () => {
            const index = MathUtils.wrapIndex(targetIndex ?? getIndex(), getStepCount());

            targetIndex = undefined;

            setSpinPhase("still");
            setIsResting(true);
            setIndex(index);

            void defs.onSpinEnd?.(index);

            LiveAnnouncerUtils.announce(getStepLabel(index));
        };

        const spin = () => {
            if (!getIsSpinnable()) return;

            setIsResting(false);
            setIsAwaitingTarget(true);

            void Promise.resolve(defs.computeSpinTarget())
                .then((index) => {
                    const stepCount = getStepCount();
                    const spinDefs = defs.computeSpinDefs?.(index, stepCount) ?? DEFAULT_SPIN_DEFS;
                    const jitterAngle = RotationUtils.getJitterAngle(spinDefs.jitterRatio, stepCount);
                    const spinAngle =
                        RotationUtils.getSpinAngle(untrack(getAngle), index, stepCount, spinDefs.turns) + jitterAngle;

                    targetIndex = index;

                    setSpinPhase("spinning");
                    setIsAwaitingTarget(false);

                    turnTo(spinAngle, getSpinDurationMs(), SPIN_EASING, () => {
                        if (jitterAngle === 0) {
                            settle();

                            return;
                        }

                        setSpinPhase("settling");

                        turnTo(spinAngle - jitterAngle, getSettleDurationMs(), SPIN_EASING, settle);
                    });
                })
                .catch(() => {
                    setIsAwaitingTarget(false);
                });
        };

        createEffect(() => {
            const restDurationMs = getRestDurationMs();

            if (!getIsResting() || restDurationMs < 0) return;

            const handle = setTimeout(() => setIsResting(false), restDurationMs);

            onCleanup(() => {
                clearTimeout(handle);
            });
        });

        createEffect(() => {
            const idleDelayMs = getIdleDelayMs();
            const stepAngle = getStepAngle();

            if (getPhase() !== "idling" || idleDelayMs === undefined || idleDelayMs <= 0 || stepAngle <= 0) return;

            const degreesPerMs = stepAngle / idleDelayMs;

            let previousTime = performance.now();
            let idleFrameId: number;

            const advance = (time: number) => {
                const elapsedMs = time - previousTime;

                previousTime = time;

                setAngle((angle) => angle + elapsedMs * degreesPerMs);

                idleFrameId = requestAnimationFrame(advance);
            };

            idleFrameId = requestAnimationFrame(advance);

            onCleanup(() => {
                cancelAnimationFrame(idleFrameId);
            });
        });

        createEffect(on(getSelectedIndex, (index) => defs.onStepChange?.(index), { defer: true }));

        onCleanup(stopSpinFrames);

        return {
            getAngle,
            getIndex,
            getSelectedIndex,
            getPhase,
            getStepAngle,
            getStepCount,
            getIsRotatable,
            getIsSpinnable,
            getIsAwaitingTarget,
            spin,
        };
    };
}
