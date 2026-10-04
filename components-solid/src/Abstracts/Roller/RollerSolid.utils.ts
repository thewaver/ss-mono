import type { Accessor } from "solid-js";
import { createComputed, createEffect, createMemo, on, onCleanup, untrack } from "solid-js";

import { ROLLER_DEFAULTS, RollerUtils } from "@thewaver/ss-components";
import { RotationUtils } from "@thewaver/ss-utils";

import { access } from "../../Utils/propUtils";
import { accessStore } from "../../Utils/storeUtils";
import { InteractionTrackerSolidUtils } from "../InteractionTracker/InteractionTrackerSolid.utils";
import { SignalMirrorSolidUtils } from "../SignalMirror/SignalMirrorSolid.utils";
import type { RollerDefs } from "./RollerSolid.types";

/** The Solid side of {@link RollerUtils}: one solid driven from accessors and read back as signals. */
export namespace RollerSolidUtils {
    /**
     * Drives one solid of faces.
     *
     * {@link RollerUtils.createRoller} with its inputs read from accessors and props, its state read as signals, and
     * its timers following them: the rest after a landing, idle drift while the solid is idling, a consumer's own write
     * to the target face settling the solid there, a change of faces answered by `reshape`, and the drag and the arrow
     * keys attached to the element while it exists. Idle drift stops on its own while the tab is in the background,
     * during the rest after a landing, and whenever the solid cannot turn at all. The solid starts on the target face.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getRef The element that takes the drag and the keys.
     * @param getIsDisabled Whether the solid may turn.
     * @param defs.faces The faces, by the direction each points and the direction that reads as down on it.
     * @param defs.radius How large the solid is drawn, center to corner, in pixels.
     * @param defs.targetFace The face the solid is heading for or last landed on, if the consumer wants to drive or
     * observe it. Writing it settles the solid there, unless something is under way; the roller writes it as soon as
     * a roll's result is known, and when a drag or a step chooses a face. An internal signal is used when omitted.
     * @param defs.autoSpin Whether idle drift is allowed. On when omitted.
     * @param defs.idleDelayMs How long one step of idle drift takes, a step being a turn about the drift axis by a
     * full turn shared among the faces. Omitted means no drift.
     * @param defs.driftAxis The axis on screen idle drift turns about.
     * @param defs.isMovable Whether the drag and the arrow keys turn the solid.
     * @param defs.computeRollTarget Chooses the face a roll lands on, and may answer later. Without it `roll` declines.
     * @returns `getOrientation` for the transform, `getTargetFace`, `getCurrentFace` for the face nearest the viewer
     * right now, `getRestingFace` for the face it rests on, `undefined` while it turns, `getPhase`, `getFaceCount`,
     * `getIsRotatable`, `getIsRollable` for enabling a control, `getIsAwaitingTarget`, `getIsBusy` for a turn somebody
     * started, and the commands `roll` and `step`.
     */
    export const createRoller = (
        getRef: Accessor<HTMLElement | undefined>,
        getIsDisabled: Accessor<boolean>,
        defs: RollerDefs,
    ) => {
        const targetFaceSignal = SignalMirrorSolidUtils.createOptional(() => defs.targetFace, 0);
        const [getRawTargetFace] = targetFaceSignal;
        const [getIsAutoSpinEnabled] = SignalMirrorSolidUtils.createOptional(() => defs.autoSpin, true);

        const getFaces = createMemo(() => access(defs.faces));

        const getFaceCount = createMemo(() => getFaces().length);

        const getTargetFace = createMemo(() => RollerUtils.clampFace(getRawTargetFace(), getFaceCount()));

        const getStepAngle = createMemo(() => RotationUtils.getStepAngle(getFaceCount()));

        const getRestDurationMs = createMemo(() => access(defs.restDurationMs) ?? ROLLER_DEFAULTS.restDurationMs);

        const getIdleDelayMs = createMemo(() => access(defs.idleDelayMs));

        const getDriftAxis = createMemo(() => access(defs.driftAxis) ?? ROLLER_DEFAULTS.driftAxis);

        const roller = RollerUtils.createRoller({
            getIsDisabled,
            getFaces,
            getRollDurationMs: () => access(defs.rollDurationMs) ?? ROLLER_DEFAULTS.rollDurationMs,
            getSettleDurationMs: () => access(defs.settleDurationMs) ?? ROLLER_DEFAULTS.settleDurationMs,
            getTumbleCount: () => access(defs.tumbleCount) ?? ROLLER_DEFAULTS.tumbleCount,
            getMomentumMs: () => access(defs.momentumMs) ?? ROLLER_DEFAULTS.momentumMs,
            getRadius: () => access(defs.radius),
            getIsMovable: () => access(defs.isMovable) ?? false,
            targetFace: targetFaceSignal,
            get computeRollTarget() {
                return defs.computeRollTarget;
            },
            computeFaceLabel: (index, faceCount) => defs.computeFaceLabel(index, faceCount),
            onRollEnd: (index) => defs.onRollEnd?.(index),
        });

        onCleanup(roller.stop);

        roller.rest(untrack(getTargetFace));

        const getOrientation = accessStore(roller, (state) => state.orientation);
        const getRollPhase = accessStore(roller, (state) => state.rollPhase);
        const getIsAwaitingTarget = accessStore(roller, (state) => state.isAwaitingTarget);
        const getIsResting = accessStore(roller, (state) => state.isResting);
        const getRestingFace = accessStore(roller, (state) => state.restingFace);

        const getIsRotatable = createMemo(() => RollerUtils.getIsRotatable(getIsDisabled(), getFaceCount()));

        const getIsPageHidden = InteractionTrackerSolidUtils.trackPageHidden();

        const getIsRollable = createMemo(
            () =>
                getIsRotatable() &&
                defs.computeRollTarget !== undefined &&
                getRollPhase() === "still" &&
                !getIsAwaitingTarget(),
        );

        const getPhase = createMemo(() =>
            RollerUtils.computePhase(
                {
                    orientation: getOrientation(),
                    rollPhase: getRollPhase(),
                    isAwaitingTarget: false,
                    isResting: getIsResting(),
                    restingFace: undefined,
                },
                {
                    idleDelayMs: getIdleDelayMs(),
                    isIdleAllowed: getIsAutoSpinEnabled() && !getIsPageHidden(),
                    isRotatable: getIsRotatable(),
                },
            ),
        );

        const getIsBusy = createMemo(() => getIsAwaitingTarget() || getRollPhase() !== "still");

        const getCurrentFace = createMemo(() => RollerUtils.getClosestFace(getFaces(), getOrientation()) ?? 0);

        createComputed(on(getTargetFace, (index) => roller.turnToTarget(index), { defer: true }));

        createComputed(on(getFaces, () => roller.reshape(), { defer: true }));

        createEffect(() => {
            const restDurationMs = getRestDurationMs();

            if (!getIsResting()) return;

            onCleanup(roller.startRest(restDurationMs));
        });

        createEffect(() => {
            const idleDelayMs = getIdleDelayMs();
            const stepAngle = getStepAngle();
            const axis = getDriftAxis();

            if (getPhase() !== "idling") return;

            onCleanup(roller.drift(idleDelayMs, stepAngle, axis));
        });

        createEffect(() => {
            const ref = getRef();

            if (!ref) return;

            onCleanup(roller.observe(ref));
        });

        return {
            getOrientation,
            getTargetFace,
            getCurrentFace,
            getRestingFace,
            getPhase,
            getFaceCount,
            getIsRotatable,
            getIsRollable,
            getIsAwaitingTarget,
            getIsBusy,
            roll: roller.roll,
            step: roller.step,
        };
    };
}
