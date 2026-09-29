import { untrack } from "svelte";

import { RotatorUtils } from "@thewaver/ss-components";
import { RotationUtils } from "@thewaver/ss-utils";

import { watchChange } from "../../Utils/effectUtils.svelte.js";
import { readStore } from "../../Utils/storeUtils.js";
import { InteractionTrackerSvelteUtils } from "../InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
import { SignalMirrorSvelteUtils } from "../SignalMirror/SignalMirrorSvelte.utils.svelte.js";
import type { RotatorDefs } from "./RotatorSvelte.types.js";

/** The Svelte side of {@link RotatorUtils}: one wheel driven from getters and read back as getters. */
export namespace RotatorSvelteUtils {
    /**
     * Drives one wheel.
     *
     * {@link RotatorUtils.createRotator} with its inputs read from getters, its state read as getters, and its timers
     * following them: the rest after a landing, idle drift while the wheel is idling, and a consumer's own write to
     * the target index turning the wheel there. Idle drift stops on its own while the tab is in the background,
     * during the rest period after a spin, and whenever the wheel cannot rotate at all.
     *
     * Must run while a component is being set up.
     *
     * @param getIsDisabled Whether the wheel may rotate.
     * @param defs.getStepCount How many steps the wheel has. Fewer than two and it cannot rotate.
     * @param defs.targetIndex The step the wheel is heading for, if the consumer wants to drive or observe it.
     * Writing it turns the wheel there, unless a spin is under way; the wheel writes it as soon as a spin's target is
     * known, rather than when the spin lands, and idle drift leaves it alone. A value of the wheel's own is used when
     * omitted.
     * @param defs.getIsAutoSpinEnabled Whether idle drift is allowed. On when omitted.
     * @param defs.getSpinDurationMs How long a spin takes.
     * @param defs.getSettleDurationMs How long the drift back from an overshoot takes.
     * @param defs.getRestDurationMs How long the wheel stays still after landing before idling resumes.
     * @param defs.getIdleDelayMs How long one step of idle drift takes. `undefined` means no drift.
     * @param defs.computeSpinTarget Chooses the step to land on. May return a promise, in which case the wheel waits
     * for it before starting; a rejection abandons the spin and leaves the wheel where it was.
     * @param defs.computeSpinDefs How many turns to take and how far to overshoot, per target. Its presence is read
     * at each spin.
     * @param defs.computeStepLabel How to announce the step landed on, given its zero-based index and the step count.
     * @param defs.onSpinEnd Called with the step landed on.
     * @param defs.onStepChange Called whenever the step under the marker changes, drift included.
     * @returns `getAngle` for the transform to apply, `getTargetIndex` for the step the wheel is heading for,
     * `getCurrentIndex` for whatever is under the marker right now, `getPhase` — `"still"`, `"idling"`, `"spinning"`
     * or `"settling"` — `getStepAngle` and `getStepCount` for laying the steps out, `getIsRotatable`, `getIsSpinnable`
     * for enabling the button, `getIsAwaitingTarget` for the wait on an asynchronous target, and `spin` to start one.
     */
    export const createRotator = (getIsDisabled: () => boolean, defs: RotatorDefs) => {
        const targetIndex = SignalMirrorSvelteUtils.createOptional(() => defs.targetIndex, 0);
        const [getTargetIndex] = targetIndex;

        const stepCount = $derived(Math.max(0, Math.trunc(defs.getStepCount())));
        const stepAngle = $derived(RotationUtils.getStepAngle(stepCount));
        const restDurationMs = $derived(defs.getRestDurationMs?.() ?? RotatorUtils.DEFAULT_REST_DURATION_MS);
        const idleDelayMs = $derived(defs.getIdleDelayMs?.());

        const rotator = RotatorUtils.createRotator({
            getIsDisabled,
            getStepCount: () => stepCount,
            getSpinDurationMs: () => defs.getSpinDurationMs?.() ?? RotatorUtils.DEFAULT_SPIN_DURATION_MS,
            getSettleDurationMs: () => defs.getSettleDurationMs?.() ?? RotatorUtils.DEFAULT_SETTLE_DURATION_MS,
            targetIndex,
            computeSpinTarget: () => defs.computeSpinTarget(),
            get computeSpinDefs() {
                return defs.computeSpinDefs;
            },
            computeStepLabel: (index, count) => defs.computeStepLabel(index, count),
            onSpinEnd: (index) => defs.onSpinEnd?.(index),
        });

        $effect(() => rotator.stop);

        const getAngle = readStore(rotator, (state) => state.angle);
        const getSpinPhase = readStore(rotator, (state) => state.spinPhase);
        const getIsAwaitingTarget = readStore(rotator, (state) => state.isAwaitingTarget);
        const getIsResting = readStore(rotator, (state) => state.isResting);

        const getIsPageHidden = InteractionTrackerSvelteUtils.trackPageHidden();

        const isRotatable = $derived(RotatorUtils.getIsRotatable(getIsDisabled(), stepCount));

        const isSpinnable = $derived(isRotatable && getSpinPhase() === "still" && !getIsAwaitingTarget());

        const phase = $derived(
            RotatorUtils.computePhase(
                {
                    angle: 0,
                    spinPhase: getSpinPhase(),
                    isAwaitingTarget: false,
                    isResting: getIsResting(),
                },
                {
                    idleDelayMs,
                    isIdleAllowed: (defs.getIsAutoSpinEnabled?.() ?? true) && !getIsPageHidden(),
                    isRotatable,
                },
            ),
        );

        const currentIndex = $derived(RotationUtils.getAngleIndex(getAngle(), stepCount));

        $effect(() => {
            const durationMs = restDurationMs;

            if (!getIsResting()) return;

            return untrack(() => rotator.startRest(durationMs));
        });

        $effect(() => {
            const delayMs = idleDelayMs;
            const angle = stepAngle;

            if (phase !== "idling") return;

            return untrack(() => rotator.drift(delayMs, angle));
        });

        watchChange(getTargetIndex, (index) => rotator.turnToTarget(index));

        watchChange(
            () => currentIndex,
            (index) => defs.onStepChange?.(index),
        );

        return {
            getAngle,
            getTargetIndex,
            getCurrentIndex: () => currentIndex,
            getPhase: () => phase,
            getStepAngle: () => stepAngle,
            getStepCount: () => stepCount,
            getIsRotatable: () => isRotatable,
            getIsSpinnable: () => isSpinnable,
            getIsAwaitingTarget,
            spin: rotator.spin,
        };
    };
}
