import {
    type MaybeRefOrGetter,
    type Ref,
    type ShallowRef,
    computed,
    onScopeDispose,
    shallowRef,
    toValue,
    watch,
} from "vue";

import { ROLLER_DEFAULTS, type RollerFace, RollerUtils } from "@thewaver/ss-components";
import { type Point3d, RotationUtils } from "@thewaver/ss-utils";

import { watchAfterRender } from "../../Utils/effectUtils";
import { useStore } from "../../Utils/storeUtils";
import { InteractionTrackerVueUtils } from "../InteractionTracker/InteractionTrackerVue.utils";

/** The Vue side of `RollerUtils`: one solid driven from reactive inputs and read back as refs. */
export namespace RollerVueUtils {
    /**
     * Drives one solid of faces.
     *
     * `RollerUtils.createRoller` with its inputs read as they currently stand, its state read as refs, and its timers
     * following them: the rest after a landing, idle drift while the solid is idling, a consumer's own change to the
     * target face settling the solid there, a change of faces answered by `reshape`, and the drag and the arrow keys
     * attached to the element while it exists. Idle drift stops on its own while the tab is in the background, during
     * the rest after a landing, and whenever the solid cannot turn at all. The solid starts on the target face.
     *
     * Must run inside a component's `setup`.
     *
     * @param element The element that takes the drag and the keys.
     * @param isDisabled Whether the solid may turn.
     * @param defs.faces The faces, by the direction each points and the direction that reads as down on it.
     * @param defs.radius How large the solid is drawn, center to corner, in pixels.
     * @param defs.targetFace The face the solid is heading for or last landed on, if the consumer wants to drive or
     * observe it. Changing it settles the solid there, unless something is under way; the composable writes it as soon
     * as a roll's result is known, and when a drag or a step chooses a face. A ref of its own is used when omitted.
     * Read once.
     * @param defs.isAutoSpinEnabled Whether idle drift is allowed. On when omitted.
     * @param defs.idleDelayMs How long one step of idle drift takes, a step being a turn about the drift axis by a
     * full turn shared among the faces. Omitted means no drift.
     * @param defs.driftAxis The axis on screen idle drift turns about.
     * @param defs.isMovable Whether the drag and the arrow keys turn the solid.
     * @param defs.getComputeRollTarget Answers the function that chooses the face a roll lands on, which may answer
     * later, or `undefined` for a solid that never rolls. Asked at each roll.
     * @returns Refs of `orientation` for the transform, `targetFace`, `currentFace` for the face nearest the viewer
     * right now, `restingFace` for the face it rests on, `undefined` while it turns, `phase`, `faceCount`,
     * `isRotatable`, `isRollable` for enabling a control, `isAwaitingTarget` and `isBusy` for a turn somebody started;
     * and the commands `roll` and `step`.
     */
    export const useRoller = (
        element: ShallowRef<HTMLElement | undefined>,
        isDisabled: MaybeRefOrGetter<boolean>,
        defs: {
            faces: MaybeRefOrGetter<RollerFace[]>;
            radius: MaybeRefOrGetter<number>;
            targetFace?: Ref<number>;
            isAutoSpinEnabled?: MaybeRefOrGetter<boolean | undefined>;
            rollDurationMs?: MaybeRefOrGetter<number | undefined>;
            settleDurationMs?: MaybeRefOrGetter<number | undefined>;
            restDurationMs?: MaybeRefOrGetter<number | undefined>;
            tumbleCount?: MaybeRefOrGetter<number | undefined>;
            momentumMs?: MaybeRefOrGetter<number | undefined>;
            idleDelayMs?: MaybeRefOrGetter<number | undefined>;
            driftAxis?: MaybeRefOrGetter<Point3d | undefined>;
            isMovable?: MaybeRefOrGetter<boolean | undefined>;
            getComputeRollTarget?: () => (() => number | Promise<number>) | undefined;
            computeFaceLabel: (index: number, faceCount: number) => string;
            onRollEnd?: (index: number) => void;
        },
    ) => {
        const faces = computed(() => toValue(defs.faces));
        const faceCount = computed(() => faces.value.length);
        const stepAngle = computed(() => RotationUtils.getStepAngle(faceCount.value));
        const ownTargetFace = defs.targetFace ?? shallowRef(0);
        const targetFace = computed(() => RollerUtils.clampFace(ownTargetFace.value, faceCount.value));

        const roller = RollerUtils.createRoller({
            getIsDisabled: () => toValue(isDisabled),
            getFaces: () => faces.value,
            getRollDurationMs: () => toValue(defs.rollDurationMs) ?? ROLLER_DEFAULTS.rollDurationMs,
            getSettleDurationMs: () => toValue(defs.settleDurationMs) ?? ROLLER_DEFAULTS.settleDurationMs,
            getTumbleCount: () => toValue(defs.tumbleCount) ?? ROLLER_DEFAULTS.tumbleCount,
            getMomentumMs: () => toValue(defs.momentumMs) ?? ROLLER_DEFAULTS.momentumMs,
            getRadius: () => toValue(defs.radius),
            getIsMovable: () => toValue(defs.isMovable) ?? false,
            targetFace: [
                () => ownTargetFace.value,
                (value) => {
                    ownTargetFace.value = value;
                },
            ],
            get computeRollTarget() {
                return defs.getComputeRollTarget?.();
            },
            computeFaceLabel: (index, count) => defs.computeFaceLabel(index, count),
            onRollEnd: (index) => defs.onRollEnd?.(index),
        });

        roller.rest(targetFace.value);

        const state = useStore(roller);
        const isPageHidden = InteractionTrackerVueUtils.usePageHidden();
        const isRotatable = computed(() => RollerUtils.getIsRotatable(toValue(isDisabled), faceCount.value));

        const phase = computed(() =>
            RollerUtils.computePhase(state.value, {
                idleDelayMs: toValue(defs.idleDelayMs),
                isIdleAllowed: (toValue(defs.isAutoSpinEnabled) ?? true) && !isPageHidden.value,
                isRotatable: isRotatable.value,
            }),
        );

        onScopeDispose(roller.stop);

        watch(targetFace, (index) => roller.turnToTarget(index), { flush: "post" });

        watch(faces, () => roller.reshape(), { flush: "post" });

        watchAfterRender(
            [() => state.value.isResting, () => toValue(defs.restDurationMs) ?? ROLLER_DEFAULTS.restDurationMs],
            ([isResting, restDurationMs]) => (isResting ? roller.startRest(restDurationMs) : undefined),
        );

        const driftAxis = computed(() => toValue(defs.driftAxis) ?? ROLLER_DEFAULTS.driftAxis);

        watchAfterRender(
            [phase, () => toValue(defs.idleDelayMs), stepAngle, driftAxis],
            ([current, idleDelayMs, angle, axis]) =>
                current === "idling" ? roller.drift(idleDelayMs, angle, axis) : undefined,
        );

        watchAfterRender([element], ([target]) => (target ? roller.observe(target) : undefined));

        return {
            orientation: computed(() => state.value.orientation),
            targetFace,
            currentFace: computed(() => RollerUtils.getClosestFace(faces.value, state.value.orientation) ?? 0),
            restingFace: computed(() => state.value.restingFace),
            phase,
            faceCount,
            isRotatable,
            isRollable: computed(() =>
                RollerUtils.getIsRollable(state.value, isRotatable.value, defs.getComputeRollTarget?.() !== undefined),
            ),
            isAwaitingTarget: computed(() => state.value.isAwaitingTarget),
            isBusy: computed(() => RollerUtils.getIsBusy(state.value)),
            roll: roller.roll,
            step: roller.step,
        };
    };
}
