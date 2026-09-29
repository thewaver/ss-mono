import type { Accessor } from "solid-js";
import { createEffect, createMemo, on, onCleanup } from "solid-js";

import { RotatorUtils } from "@thewaver/ss-components";
import { RotationUtils } from "@thewaver/ss-utils";

import { access } from "../../Utils/propUtils";
import { accessStore } from "../../Utils/storeUtils";
import { InteractionTrackerSolidUtils } from "../InteractionTracker/InteractionTrackerSolid.utils";
import { SignalMirrorSolidUtils } from "../SignalMirror/SignalMirrorSolid.utils";
import type { RotatorDefs } from "./RotatorSolid.types";

/** The Solid side of {@link RotatorUtils}: one wheel driven from accessors and read back as signals. */
export namespace RotatorSolidUtils {
    /**
     * Drives one wheel.
     *
     * {@link RotatorUtils.createRotator} with its inputs read from accessors and props, its state read as
     * signals, and its timers following them: the rest after a landing, idle drift while the wheel is idling, and a
     * consumer's own write to the target index turning the wheel there. Idle drift stops on its own while the tab
     * is in the background, during the rest period after a spin, and whenever the wheel cannot rotate at all.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getIsDisabled Whether the wheel may rotate.
     * @param defs.stepCount How many steps the wheel has. Fewer than two and it cannot rotate.
     * @param defs.targetIndex The step the wheel is heading for, if the consumer wants to drive or
     * observe it. Writing it turns the wheel there, unless a spin is under way; the component writes it as
     * soon as a spin's target is known, rather than when the spin lands, and idle drift leaves it alone. An
     * internal signal is used when omitted.
     * @param defs.autoSpin Whether idle drift is allowed. On when omitted.
     * @param defs.spinDurationMs How long a spin takes.
     * @param defs.settleDurationMs How long the drift back from an overshoot takes.
     * @param defs.restDurationMs How long the wheel stays still after landing before idling resumes.
     * @param defs.idleDelayMs How long one step of idle drift takes. Omitted means no drift.
     * @param defs.computeSpinTarget Chooses the step to land on. May return a promise, in which case
     * the wheel waits for it before starting; a rejection abandons the spin and leaves the wheel where
     * it was.
     * @param defs.computeSpinDefs How many turns to take and how far to overshoot, per target.
     * @param defs.computeStepLabel How to announce the step landed on, given its zero-based index and
     * the step count.
     * @param defs.onSpinEnd Called with the step landed on.
     * @param defs.onStepChange Called whenever the step under the marker changes, drift included.
     * @returns `getAngle` for the transform to apply, `getTargetIndex` for the step the wheel is heading
     * for, `getCurrentIndex` for whatever is under the marker right now, `getPhase` — `"still"`, `"idling"`, `"spinning"` or
     * `"settling"` — `getStepAngle` and `getStepCount` for laying the steps out, `getIsRotatable`,
     * `getIsSpinnable` for enabling the button, `getIsAwaitingTarget` for the wait on an asynchronous
     * target, and `spin` to start one.
     */
    export const createRotator = (getIsDisabled: Accessor<boolean>, defs: RotatorDefs) => {
        const targetIndexSignal = SignalMirrorSolidUtils.createOptional(() => defs.targetIndex, 0);
        const [getTargetIndex] = targetIndexSignal;
        const [getIsAutoSpinEnabled] = SignalMirrorSolidUtils.createOptional(() => defs.autoSpin, true);

        const getStepCount = createMemo(() => Math.max(0, Math.trunc(access(defs.stepCount))));

        const getStepAngle = createMemo(() => RotationUtils.getStepAngle(getStepCount()));

        const getSpinDurationMs = createMemo(
            () => access(defs.spinDurationMs) ?? RotatorUtils.DEFAULT_SPIN_DURATION_MS,
        );

        const getSettleDurationMs = createMemo(
            () => access(defs.settleDurationMs) ?? RotatorUtils.DEFAULT_SETTLE_DURATION_MS,
        );

        const getRestDurationMs = createMemo(
            () => access(defs.restDurationMs) ?? RotatorUtils.DEFAULT_REST_DURATION_MS,
        );

        const getIdleDelayMs = createMemo(() => access(defs.idleDelayMs));

        const rotator = RotatorUtils.createRotator({
            getIsDisabled,
            getStepCount,
            getSpinDurationMs,
            getSettleDurationMs,
            targetIndex: targetIndexSignal,
            computeSpinTarget: () => defs.computeSpinTarget(),
            computeSpinDefs: defs.computeSpinDefs && ((index, stepCount) => defs.computeSpinDefs!(index, stepCount)),
            computeStepLabel: (index, stepCount) => defs.computeStepLabel(index, stepCount),
            onSpinEnd: (index) => defs.onSpinEnd?.(index),
        });

        onCleanup(rotator.stop);

        const getAngle = accessStore(rotator, (state) => state.angle);
        const getSpinPhase = accessStore(rotator, (state) => state.spinPhase);
        const getIsAwaitingTarget = accessStore(rotator, (state) => state.isAwaitingTarget);
        const getIsResting = accessStore(rotator, (state) => state.isResting);

        const getIsRotatable = createMemo(() => RotatorUtils.getIsRotatable(getIsDisabled(), getStepCount()));

        const getIsPageHidden = InteractionTrackerSolidUtils.trackPageHidden();

        const getIsSpinnable = createMemo(
            () => getIsRotatable() && getSpinPhase() === "still" && !getIsAwaitingTarget(),
        );

        const getPhase = createMemo(() =>
            RotatorUtils.computePhase(
                {
                    angle: 0,
                    spinPhase: getSpinPhase(),
                    isAwaitingTarget: false,
                    isResting: getIsResting(),
                },
                {
                    idleDelayMs: getIdleDelayMs(),
                    isIdleAllowed: getIsAutoSpinEnabled() && !getIsPageHidden(),
                    isRotatable: getIsRotatable(),
                },
            ),
        );

        const getCurrentIndex = createMemo(() => RotationUtils.getAngleIndex(getAngle(), getStepCount()));

        createEffect(() => {
            const restDurationMs = getRestDurationMs();

            if (!getIsResting()) return;

            onCleanup(rotator.startRest(restDurationMs));
        });

        createEffect(() => {
            const idleDelayMs = getIdleDelayMs();
            const stepAngle = getStepAngle();

            if (getPhase() !== "idling") return;

            onCleanup(rotator.drift(idleDelayMs, stepAngle));
        });

        createEffect(on(getTargetIndex, (index) => rotator.turnToTarget(index), { defer: true }));

        createEffect(on(getCurrentIndex, (index) => defs.onStepChange?.(index), { defer: true }));

        return {
            getAngle,
            getTargetIndex,
            getCurrentIndex,
            getPhase,
            getStepAngle,
            getStepCount,
            getIsRotatable,
            getIsSpinnable,
            getIsAwaitingTarget,
            spin: rotator.spin,
        };
    };
}
