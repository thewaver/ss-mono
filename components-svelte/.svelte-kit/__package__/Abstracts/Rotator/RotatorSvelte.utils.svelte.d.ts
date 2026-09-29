import type { RotatorDefs } from "./RotatorSvelte.types.js";
/** The Svelte side of {@link RotatorUtils}: one wheel driven from getters and read back as getters. */
export declare namespace RotatorSvelteUtils {
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
    const createRotator: (getIsDisabled: () => boolean, defs: RotatorDefs) => {
        getAngle: () => number;
        getTargetIndex: () => number;
        getCurrentIndex: () => number;
        getPhase: () => import("@thewaver/ss-components").RotatorPhase;
        getStepAngle: () => number;
        getStepCount: () => number;
        getIsRotatable: () => boolean;
        getIsSpinnable: () => boolean;
        getIsAwaitingTarget: () => boolean;
        spin: () => boolean;
    };
}
