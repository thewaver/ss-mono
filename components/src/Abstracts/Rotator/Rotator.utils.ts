import type { EasingFn } from "@thewaver/ss-utils";
import { EasingUtils, MathUtils, RotationUtils, StoreUtils } from "@thewaver/ss-utils";

import { LiveAnnouncerUtils } from "../LiveAnnouncer/LiveAnnouncer.utils";
import { TurnClockUtils } from "../TurnClock/TurnClock.utils";
import type { RotatorController, RotatorCoreDefs, RotatorPhase, RotatorSpinDefs, RotatorState } from "./Rotator.types";

/** Three whole turns and no overshoot, when the caller does not say. */
const DEFAULT_SPIN_DEFS: RotatorSpinDefs = { turns: 3, jitterRatio: 0 };
/** Fewer than two steps and there is nowhere to rotate to. */
const MIN_ROTATABLE_STEP_COUNT = 2;
/** A consumer's own move goes straight to the step, with none of a spin's extra revolutions. */
const NO_TURNS = 0;
/** Eases in and out, so a spin starts and stops rather than snapping to speed. */
const SPIN_EASING: EasingFn = EasingUtils.ease;
/** At rest at nought degrees, with nothing under way. */
const RESTING_STATE: RotatorState = { angle: 0, spinPhase: "still", isAwaitingTarget: false, isResting: false };

/**
 * Spins a wheel of steps to a chosen one and reports where it is throughout.
 *
 * The wheel of fortune shape: it drifts while idle, spins several turns when asked, overshoots its
 * target slightly and drifts back, then rests. What makes it more than an animation is that the
 * target can be decided asynchronously — the caller is asked for it when the spin begins, so a
 * server can pick the outcome while the wheel is already turning.
 */
export namespace RotatorUtils {
    /** How long a spin takes when the caller does not say. */
    export const DEFAULT_SPIN_DURATION_MS = 3000;

    /** How long the drift back from an overshoot takes when the caller does not say. */
    export const DEFAULT_SETTLE_DURATION_MS = 1500;

    /** How long the wheel stays still after a spin before idling resumes, when the caller does not say. */
    export const DEFAULT_REST_DURATION_MS = 3000;

    /**
     * Whether a wheel can rotate at all: it is enabled and has at least two steps to rotate between.
     *
     * @param isDisabled Whether the wheel is off.
     * @param stepCount How many steps it has.
     */
    export const getIsRotatable = (isDisabled: boolean, stepCount: number) =>
        !isDisabled && stepCount >= MIN_ROTATABLE_STEP_COUNT;

    /**
     * Whether a spin could start right now: the wheel can rotate, is standing still, and is not waiting on a target.
     *
     * @param state What the rotator holds.
     * @param isRotatable The answer from {@link getIsRotatable}.
     */
    export const getIsSpinnable = (state: RotatorState, isRotatable: boolean) =>
        isRotatable && state.spinPhase === "still" && !state.isAwaitingTarget;

    /**
     * What a wheel is doing, from what its rotator holds and whether idle drift is allowed.
     *
     * A spin or a settle under way is reported as itself. Otherwise the wheel is idling when drift has a delay, is
     * allowed, the rest after a spin is over, and the wheel can rotate — and still when any of those fails.
     *
     * @param state What the rotator holds.
     * @param opts.idleDelayMs How long one step of idle drift takes. `undefined` means no drift.
     * @param opts.isIdleAllowed Whether drift is allowed at all — switched on, and the tab in the foreground.
     * @param opts.isRotatable The answer from {@link getIsRotatable}.
     */
    export const computePhase = (
        state: RotatorState,
        opts: { idleDelayMs: number | undefined; isIdleAllowed: boolean; isRotatable: boolean },
    ): RotatorPhase => {
        if (state.spinPhase !== "still") return state.spinPhase;

        return TurnClockUtils.getIsIdling({ ...opts, isResting: state.isResting }) ? "idling" : "still";
    };

    /**
     * Drives one wheel.
     *
     * The angle is the single source of truth and the selected step is read back out of it, so whatever
     * is under the marker is what is reported, whether the wheel got there by spinning, by drifting or
     * by the consumer setting the index directly. The step that was landed on is announced, since a
     * screen reader user cannot see the wheel stop.
     *
     * The rotator is a store of the angle, the spin phase, whether a target is being waited on, and whether the
     * wheel is resting after a spin. Its commands:
     *
     * - `spin` starts a spin if one could start, by {@link getIsSpinnable}, and says whether it did. The target is
     *   asked for at once and written to the target index as soon as it is known.
     * - `turnToTarget` turns the wheel to a step the consumer chose, unless a spin is under way or it is already
     *   there. Call it when the target index changes from outside.
     * - `startRest` holds the wheel still after landing, for the given time, and returns the function that calls
     *   it off. It does nothing unless the wheel is resting; a negative time rests for good.
     * - `drift` turns the wheel one step per `idleDelayMs` on animation frames, and returns the function that
     *   stops it. It does nothing without a positive delay and step angle. Call it while {@link computePhase} says
     *   `"idling"`.
     * - `stop` abandons whatever is under way — a spin's frames, its backstop timer, a target still being waited
     *   for — and leaves the wheel still where it is, usable again. Call it when the owner goes away.
     *
     * Every function in `defs` is read when it is needed.
     *
     * @param defs.getIsDisabled Whether the wheel may rotate.
     * @param defs.getStepCount How many steps the wheel has. Fewer than two and it cannot rotate.
     * @param defs.getSpinDurationMs How long a spin takes.
     * @param defs.getSettleDurationMs How long the drift back from an overshoot takes, and a consumer's own move.
     * @param defs.targetIndex The step the wheel is heading for, read and written.
     * @param defs.computeSpinTarget Chooses the step to land on. May return a promise, in which case
     * the wheel waits for it before starting; a rejection abandons the spin and leaves the wheel where
     * it was.
     * @param defs.computeSpinDefs How many turns to take and how far to overshoot, per target. An
     * overshoot is what makes the wheel look like it is losing momentum rather than stopping dead.
     * @param defs.computeStepLabel How to announce the step landed on, given its zero-based index and
     * the step count.
     * @param defs.onSpinEnd Called with the step landed on.
     * @returns The rotator.
     */
    export const createRotator = (defs: RotatorCoreDefs): RotatorController => {
        LiveAnnouncerUtils.reserve("polite");

        const store = StoreUtils.create(RESTING_STATE, { isEqual: StoreUtils.getIsShallowEqual });
        const [getTargetIndex, setTargetIndex] = defs.targetIndex;

        const write = (next: Partial<RotatorState>) => store.update((current) => ({ ...current, ...next }));

        let targetIndex: number | undefined;

        const tween = TurnClockUtils.createTween();
        const targetRequest = TurnClockUtils.createTargetRequest();

        const getStepLabel = (index: number) => defs.computeStepLabel(index, defs.getStepCount());

        const turnTo = (toAngle: number, durationMs: number, easing: EasingFn, onArrival: () => void) => {
            const fromAngle = store.get().angle;

            tween.run(
                durationMs,
                (ratio) => write({ angle: MathUtils.lerp(fromAngle, toAngle, easing(ratio)) }),
                () => {
                    write({ angle: toAngle });
                    onArrival();
                },
            );
        };

        const land = (index: number) => {
            write({ spinPhase: "still", isResting: true });
            setTargetIndex(index);

            LiveAnnouncerUtils.announce(getStepLabel(index));
        };

        const settle = () => {
            const index = MathUtils.wrapIndex(targetIndex ?? getTargetIndex(), defs.getStepCount());

            targetIndex = undefined;

            land(index);

            void defs.onSpinEnd?.(index);
        };

        const spin = () => {
            if (!getIsSpinnable(store.get(), getIsRotatable(defs.getIsDisabled(), defs.getStepCount()))) return false;

            write({ isResting: false, isAwaitingTarget: true });

            targetRequest.request(
                () => defs.computeSpinTarget(),
                (index) => {
                    const stepCount = defs.getStepCount();
                    const spinDefs = defs.computeSpinDefs?.(index, stepCount) ?? DEFAULT_SPIN_DEFS;
                    const jitterAngle = RotationUtils.getJitterAngle(spinDefs.jitterRatio, stepCount);
                    const spinAngle =
                        RotationUtils.getSpinAngle(store.get().angle, index, stepCount, spinDefs.turns) + jitterAngle;

                    targetIndex = index;

                    write({ spinPhase: "spinning", isAwaitingTarget: false });
                    setTargetIndex(MathUtils.wrapIndex(index, stepCount));

                    turnTo(spinAngle, defs.getSpinDurationMs(), SPIN_EASING, () => {
                        if (jitterAngle === 0) {
                            settle();

                            return;
                        }

                        write({ spinPhase: "settling" });

                        turnTo(spinAngle - jitterAngle, defs.getSettleDurationMs(), SPIN_EASING, settle);
                    });
                },
                () => write({ isAwaitingTarget: false }),
            );

            return true;
        };

        const turnToTarget = (index: number) => {
            const state = store.get();

            if (state.spinPhase !== "still" || state.isAwaitingTarget) return;

            const stepCount = defs.getStepCount();
            const wrapped = MathUtils.wrapIndex(index, stepCount);

            if (stepCount < MIN_ROTATABLE_STEP_COUNT) return;
            if (wrapped === RotationUtils.getAngleIndex(state.angle, stepCount)) return;

            write({ spinPhase: "settling" });

            turnTo(
                RotationUtils.getSpinAngle(state.angle, wrapped, stepCount, NO_TURNS),
                defs.getSettleDurationMs(),
                SPIN_EASING,
                () => land(wrapped),
            );
        };

        const startRest = (restDurationMs: number) => {
            if (!store.get().isResting) return () => {};

            return TurnClockUtils.holdRest(restDurationMs, () => write({ isResting: false }));
        };

        const drift = (idleDelayMs: number | undefined, stepAngle: number) => {
            if (idleDelayMs === undefined || idleDelayMs <= 0 || stepAngle <= 0) return () => {};

            const degreesPerMs = stepAngle / idleDelayMs;

            return TurnClockUtils.runFrames((elapsedMs) =>
                store.update((current) => ({ ...current, angle: current.angle + elapsedMs * degreesPerMs })),
            );
        };

        const stop = () => {
            targetRequest.cancel();
            targetIndex = undefined;

            tween.cancel();
            write({ spinPhase: "still", isAwaitingTarget: false });
        };

        return { get: store.get, subscribe: store.subscribe, spin, turnToTarget, startRest, drift, stop };
    };
}
