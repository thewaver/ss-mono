import { type MaybeRefOrGetter, type Ref, computed, onScopeDispose, shallowRef, toValue, watch } from "vue";

import { type RotatorSpinDefs, RotatorUtils } from "@thewaver/ss-components";
import { RotationUtils } from "@thewaver/ss-utils";

import { watchAfterRender } from "../../Utils/effectUtils";
import { useStore } from "../../Utils/storeUtils";
import { InteractionTrackerVueUtils } from "../InteractionTracker/InteractionTrackerVue.utils";

/** The Vue side of `RotatorUtils`: one wheel driven from reactive inputs and read back as refs. */
export namespace RotatorVueUtils {
    /**
     * Drives one wheel.
     *
     * `RotatorUtils.createRotator` with its inputs read as they currently stand, its state read as refs, and its
     * timers following them: the rest after a landing, idle drift while the wheel is idling, and a consumer's own
     * change to the target index turning the wheel there. Idle drift stops on its own while the tab is in the
     * background, during the rest period after a spin, and whenever the wheel cannot rotate at all.
     *
     * Must run inside a component's `setup`.
     *
     * @param isDisabled Whether the wheel may rotate.
     * @param defs.stepCount How many steps the wheel has. Fewer than two and it cannot rotate.
     * @param defs.targetIndex The step the wheel is heading for, if the consumer wants to drive or observe it.
     * Changing it turns the wheel there, unless a spin is under way; the composable writes it as soon as a spin's
     * target is known. A ref of the composable's own is used when omitted. Read once.
     * @param defs.isAutoSpinEnabled Whether idle drift is allowed. On when omitted.
     * @param defs.spinDurationMs How long a spin takes.
     * @param defs.settleDurationMs How long the drift back from an overshoot takes.
     * @param defs.restDurationMs How long the wheel stays still after landing before idling resumes.
     * @param defs.idleDelayMs How long one step of idle drift takes. Omitted means no drift.
     * @param defs.computeSpinTarget Chooses the step to land on. May return a promise; a rejection abandons the spin.
     * @param defs.getComputeSpinDefs Answers how many turns to take and how far to overshoot, per target, or
     * `undefined` for the defaults. Asked at each spin.
     * @param defs.computeStepLabel How to announce the step landed on, given its zero-based index and the step count.
     * @param defs.onSpinEnd Called with the step landed on.
     * @param defs.onStepChange Called whenever the step under the marker changes, drift included.
     * @returns Refs of `angle` for the transform to apply, `targetIndex`, `currentIndex` for whatever is under the
     * marker, `phase`, `stepAngle` and `stepCount` for laying the steps out, `isRotatable`, `isSpinnable` for
     * enabling the button and `isAwaitingTarget` for the wait on an asynchronous target; and `spin` to start one.
     */
    export const useRotator = (
        isDisabled: MaybeRefOrGetter<boolean>,
        defs: {
            stepCount: MaybeRefOrGetter<number>;
            targetIndex?: Ref<number>;
            isAutoSpinEnabled?: MaybeRefOrGetter<boolean | undefined>;
            spinDurationMs?: MaybeRefOrGetter<number | undefined>;
            settleDurationMs?: MaybeRefOrGetter<number | undefined>;
            restDurationMs?: MaybeRefOrGetter<number | undefined>;
            idleDelayMs?: MaybeRefOrGetter<number | undefined>;
            computeSpinTarget: () => number | Promise<number>;
            getComputeSpinDefs?: () => ((index: number, stepCount: number) => RotatorSpinDefs) | undefined;
            computeStepLabel: (index: number, stepCount: number) => string;
            onSpinEnd?: (index: number) => void;
            onStepChange?: (index: number) => void;
        },
    ) => {
        const stepCount = computed(() => Math.max(0, Math.trunc(toValue(defs.stepCount))));
        const stepAngle = computed(() => RotationUtils.getStepAngle(stepCount.value));
        const targetIndex = defs.targetIndex ?? shallowRef(0);

        const rotator = RotatorUtils.createRotator({
            getIsDisabled: () => toValue(isDisabled),
            getStepCount: () => stepCount.value,
            getSpinDurationMs: () => toValue(defs.spinDurationMs) ?? RotatorUtils.DEFAULT_SPIN_DURATION_MS,
            getSettleDurationMs: () => toValue(defs.settleDurationMs) ?? RotatorUtils.DEFAULT_SETTLE_DURATION_MS,
            targetIndex: [
                () => targetIndex.value,
                (value) => {
                    targetIndex.value = value;
                },
            ],
            computeSpinTarget: () => defs.computeSpinTarget(),
            get computeSpinDefs() {
                return defs.getComputeSpinDefs?.();
            },
            computeStepLabel: (index, count) => defs.computeStepLabel(index, count),
            onSpinEnd: (index) => defs.onSpinEnd?.(index),
        });

        const state = useStore(rotator);
        const isPageHidden = InteractionTrackerVueUtils.usePageHidden();
        const isRotatable = computed(() => RotatorUtils.getIsRotatable(toValue(isDisabled), stepCount.value));

        const phase = computed(() =>
            RotatorUtils.computePhase(state.value, {
                idleDelayMs: toValue(defs.idleDelayMs),
                isIdleAllowed: (toValue(defs.isAutoSpinEnabled) ?? true) && !isPageHidden.value,
                isRotatable: isRotatable.value,
            }),
        );

        const currentIndex = computed(() => RotationUtils.getAngleIndex(state.value.angle, stepCount.value));

        onScopeDispose(rotator.stop);

        watchAfterRender(
            [() => state.value.isResting, () => toValue(defs.restDurationMs) ?? RotatorUtils.DEFAULT_REST_DURATION_MS],
            ([isResting, restDurationMs]) => (isResting ? rotator.startRest(restDurationMs) : undefined),
        );

        watchAfterRender([phase, () => toValue(defs.idleDelayMs), stepAngle], ([current, idleDelayMs, angle]) =>
            current === "idling" ? rotator.drift(idleDelayMs, angle) : undefined,
        );

        watch(targetIndex, (index) => rotator.turnToTarget(index), { flush: "post" });

        watch(currentIndex, (index) => defs.onStepChange?.(index), { flush: "post" });

        return {
            angle: computed(() => state.value.angle),
            targetIndex: computed(() => targetIndex.value),
            currentIndex,
            phase,
            stepAngle,
            stepCount,
            isRotatable,
            isSpinnable: computed(() => RotatorUtils.getIsSpinnable(state.value, isRotatable.value)),
            isAwaitingTarget: computed(() => state.value.isAwaitingTarget),
            spin: rotator.spin,
        };
    };
}
