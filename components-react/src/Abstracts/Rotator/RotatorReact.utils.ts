import { useEffect, useRef, useState } from "react";

import { type RotatorSpinDefs, RotatorUtils } from "@thewaver/ss-components";
import { RotationUtils, StoreUtils } from "@thewaver/ss-utils";

import { useLatest } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import { InteractionTrackerReactUtils } from "../InteractionTracker/InteractionTrackerReact.utils";

/** The React side of `RotatorUtils`: one wheel driven from props and read back as state. */
export namespace RotatorReactUtils {
    /**
     * Drives one wheel.
     *
     * `RotatorUtils.createRotator` with its inputs read from this render's props, its state read as state, and its
     * timers following them: the rest after a landing, idle drift while the wheel is idling, and a consumer's own
     * change to the target index turning the wheel there. Idle drift stops on its own while the tab is in the
     * background, during the rest period after a spin, and whenever the wheel cannot rotate at all.
     *
     * @param isDisabled Whether the wheel may rotate.
     * @param defs.stepCount How many steps the wheel has. Fewer than two and it cannot rotate.
     * @param defs.targetIndexState The step the wheel is heading for, if the consumer wants to drive or observe it.
     * Changing it turns the wheel there, unless a spin is under way; the hook writes it as soon as a spin's target
     * is known. The hook's own state is used when omitted.
     * @param defs.isAutoSpinEnabled Whether idle drift is allowed. On when omitted.
     * @param defs.spinDurationMs How long a spin takes.
     * @param defs.settleDurationMs How long the drift back from an overshoot takes.
     * @param defs.restDurationMs How long the wheel stays still after landing before idling resumes.
     * @param defs.idleDelayMs How long one step of idle drift takes. Omitted means no drift.
     * @param defs.computeSpinTarget Chooses the step to land on. May return a promise; a rejection abandons the spin.
     * @param defs.computeSpinDefs How many turns to take and how far to overshoot, per target.
     * @param defs.computeStepLabel How to announce the step landed on, given its zero-based index and the step count.
     * @param defs.onSpinEnd Called with the step landed on.
     * @param defs.onStepChange Called whenever the step under the marker changes, drift included.
     * @returns `angle` for the transform to apply, `targetIndex`, `currentIndex` for whatever is under the marker,
     * `phase`, `stepAngle` and `stepCount` for laying the steps out, `isRotatable`, `isSpinnable` for enabling the
     * button, `isAwaitingTarget` for the wait on an asynchronous target, and `spin` to start one.
     */
    export const useRotator = (
        isDisabled: boolean,
        defs: {
            stepCount: number;
            targetIndexState?: readonly [number, (value: number) => void];
            isAutoSpinEnabled?: boolean;
            spinDurationMs?: number;
            settleDurationMs?: number;
            restDurationMs?: number;
            idleDelayMs?: number;
            computeSpinTarget: () => number | Promise<number>;
            computeSpinDefs?: (index: number, stepCount: number) => RotatorSpinDefs;
            computeStepLabel: (index: number, stepCount: number) => string;
            onSpinEnd?: (index: number) => void;
            onStepChange?: (index: number) => void;
        },
    ) => {
        const stepCount = Math.max(0, Math.trunc(defs.stepCount));
        const stepAngle = RotationUtils.getStepAngle(stepCount);
        const restDurationMs = defs.restDurationMs ?? RotatorUtils.DEFAULT_REST_DURATION_MS;

        const [ownTarget] = useState(() => StoreUtils.create(0));
        const ownTargetIndex = useStore(ownTarget);
        const targetIndex = defs.targetIndexState ? defs.targetIndexState[0] : ownTargetIndex;

        const latest = useLatest({ ...defs, isDisabled, stepCount });

        const [rotator] = useState(() =>
            RotatorUtils.createRotator({
                getIsDisabled: () => latest.current.isDisabled,
                getStepCount: () => latest.current.stepCount,
                getSpinDurationMs: () => latest.current.spinDurationMs ?? RotatorUtils.DEFAULT_SPIN_DURATION_MS,
                getSettleDurationMs: () => latest.current.settleDurationMs ?? RotatorUtils.DEFAULT_SETTLE_DURATION_MS,
                targetIndexSignal: [
                    () => (latest.current.targetIndexState ? latest.current.targetIndexState[0] : ownTarget.get()),
                    (value) => {
                        if (latest.current.targetIndexState) {
                            latest.current.targetIndexState[1](value);
                        } else {
                            ownTarget.set(value);
                        }
                    },
                ],
                computeSpinTarget: () => latest.current.computeSpinTarget(),
                get computeSpinDefs() {
                    return latest.current.computeSpinDefs;
                },
                computeStepLabel: (index, count) => latest.current.computeStepLabel(index, count),
                onSpinEnd: (index) => latest.current.onSpinEnd?.(index),
            }),
        );

        const state = useStore(rotator);
        const isPageHidden = InteractionTrackerReactUtils.usePageHidden();
        const isRotatable = RotatorUtils.getIsRotatable(isDisabled, stepCount);
        const phase = RotatorUtils.computePhase(state, {
            idleDelayMs: defs.idleDelayMs,
            isIdleAllowed: (defs.isAutoSpinEnabled ?? true) && !isPageHidden,
            isRotatable,
        });
        const currentIndex = RotationUtils.getAngleIndex(state.angle, stepCount);

        useEffect(() => rotator.stop, [rotator]);

        useEffect(
            () => (state.isResting ? rotator.startRest(restDurationMs) : undefined),
            [rotator, state.isResting, restDurationMs],
        );

        useEffect(
            () => (phase === "idling" ? rotator.drift(defs.idleDelayMs, stepAngle) : undefined),
            [rotator, phase, defs.idleDelayMs, stepAngle],
        );

        const lastTargetIndex = useRef(targetIndex);

        useEffect(() => {
            if (lastTargetIndex.current === targetIndex) return;

            lastTargetIndex.current = targetIndex;
            rotator.turnToTarget(targetIndex);
        }, [rotator, targetIndex]);

        const lastCurrentIndex = useRef(currentIndex);

        useEffect(() => {
            if (lastCurrentIndex.current === currentIndex) return;

            lastCurrentIndex.current = currentIndex;
            latest.current.onStepChange?.(currentIndex);
        }, [currentIndex, latest]);

        return {
            angle: state.angle,
            targetIndex,
            currentIndex,
            phase,
            stepAngle,
            stepCount,
            isRotatable,
            isSpinnable: RotatorUtils.getIsSpinnable(state, isRotatable),
            isAwaitingTarget: state.isAwaitingTarget,
            spin: rotator.spin,
        };
    };
}
