import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

import { ROLLER_DEFAULTS, type RollerFace, RollerUtils } from "@thewaver/ss-components";
import { type Point3d, RotationUtils, StoreUtils } from "@thewaver/ss-utils";

import { useElement, useLatest } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import { InteractionTrackerReactUtils } from "../InteractionTracker/InteractionTrackerReact.utils";

/** The React side of `RollerUtils`: one solid driven from props and read back as state. */
export namespace RollerReactUtils {
    /**
     * Drives one solid of faces.
     *
     * `RollerUtils.createRoller` with its inputs read from this render's props, its state read as state, and its
     * timers following them: the rest after a landing, idle drift while the solid is idling, a consumer's own change to
     * the target face settling the solid there, a change of faces answered by `reshape`, and the drag and the arrow
     * keys attached to the element while it exists. Idle drift stops on its own while the tab is in the background,
     * during the rest after a landing, and whenever the solid cannot turn at all. The solid starts on the target face.
     *
     * @param ref The element that takes the drag and the keys.
     * @param isDisabled Whether the solid may turn.
     * @param defs.faces The faces, by the direction each points and the direction that reads as down on it.
     * @param defs.radius How large the solid is drawn, center to corner, in pixels.
     * @param defs.targetFace The face the solid is heading for or last landed on, if the consumer wants to drive or
     * observe it. Changing it settles the solid there, unless something is under way; the hook writes it as soon as a
     * roll's result is known, and when a drag or a step chooses a face. The hook's own state is used when omitted.
     * @param defs.isAutoSpinEnabled Whether idle drift is allowed. On when omitted.
     * @param defs.idleDelayMs How long one step of idle drift takes, a step being a turn about the drift axis by a
     * full turn shared among the faces. Omitted means no drift.
     * @param defs.driftAxis The axis on screen idle drift turns about.
     * @param defs.isMovable Whether the drag and the arrow keys turn the solid.
     * @param defs.computeRollTarget Chooses the face a roll lands on, and may answer later. Without it `roll` declines.
     * @returns `orientation` for the transform, `targetFace`, `currentFace` for the face nearest the viewer right now,
     * `restingFace` for the face it rests on, `undefined` while it turns, `phase`, `faceCount`, `isRotatable`,
     * `isRollable` for enabling a control, `isAwaitingTarget`, `isBusy` for a turn somebody started, and the commands
     * `roll` and `step`.
     */
    export const useRoller = (
        ref: RefObject<HTMLElement | null>,
        isDisabled: boolean,
        defs: {
            faces: RollerFace[];
            radius: number;
            targetFace?: readonly [number, (value: number) => void];
            isAutoSpinEnabled?: boolean;
            rollDurationMs?: number;
            settleDurationMs?: number;
            restDurationMs?: number;
            tumbleCount?: number;
            momentumMs?: number;
            idleDelayMs?: number;
            driftAxis?: Point3d;
            isMovable?: boolean;
            computeRollTarget?: () => number | Promise<number>;
            computeFaceLabel: (index: number, faceCount: number) => string;
            onRollEnd?: (index: number) => void;
        },
    ) => {
        const faceCount = defs.faces.length;
        const stepAngle = RotationUtils.getStepAngle(faceCount);
        const restDurationMs = defs.restDurationMs ?? ROLLER_DEFAULTS.restDurationMs;
        const driftAxis = defs.driftAxis ?? ROLLER_DEFAULTS.driftAxis;

        const [ownTarget] = useState(() => StoreUtils.create(0));
        const ownTargetFace = useStore(ownTarget);
        const targetFace = RollerUtils.clampFace(defs.targetFace ? defs.targetFace[0] : ownTargetFace, faceCount);

        const latest = useLatest({ ...defs, isDisabled });

        const [roller] = useState(() =>
            RollerUtils.createRoller({
                getIsDisabled: () => latest.current.isDisabled,
                getFaces: () => latest.current.faces,
                getRollDurationMs: () => latest.current.rollDurationMs ?? ROLLER_DEFAULTS.rollDurationMs,
                getSettleDurationMs: () => latest.current.settleDurationMs ?? ROLLER_DEFAULTS.settleDurationMs,
                getTumbleCount: () => latest.current.tumbleCount ?? ROLLER_DEFAULTS.tumbleCount,
                getMomentumMs: () => latest.current.momentumMs ?? ROLLER_DEFAULTS.momentumMs,
                getRadius: () => latest.current.radius,
                getIsMovable: () => latest.current.isMovable ?? false,
                targetFace: [
                    () => (latest.current.targetFace ? latest.current.targetFace[0] : ownTarget.get()),
                    (value) => {
                        if (latest.current.targetFace) {
                            latest.current.targetFace[1](value);
                        } else {
                            ownTarget.set(value);
                        }
                    },
                ],
                get computeRollTarget() {
                    return latest.current.computeRollTarget;
                },
                computeFaceLabel: (index, count) => latest.current.computeFaceLabel(index, count),
                onRollEnd: (index) => latest.current.onRollEnd?.(index),
            }),
        );

        const state = useStore(roller);
        const element = useElement(ref);
        const isPageHidden = InteractionTrackerReactUtils.usePageHidden();
        const isRotatable = RollerUtils.getIsRotatable(isDisabled, faceCount);
        const phase = RollerUtils.computePhase(state, {
            idleDelayMs: defs.idleDelayMs,
            isIdleAllowed: (defs.isAutoSpinEnabled ?? true) && !isPageHidden,
            isRotatable,
        });

        useEffect(() => roller.stop, [roller]);

        const lastTargetFace = useRef<number>(undefined);

        useLayoutEffect(() => {
            const previous = lastTargetFace.current;

            lastTargetFace.current = targetFace;

            if (previous === undefined) {
                roller.rest(targetFace);
            } else if (previous !== targetFace) {
                roller.turnToTarget(targetFace);
            }
        }, [roller, targetFace]);

        const lastFaces = useRef(defs.faces);

        useLayoutEffect(() => {
            if (lastFaces.current === defs.faces) return;

            lastFaces.current = defs.faces;
            roller.reshape();
        }, [roller, defs.faces]);

        useEffect(
            () => (state.isResting ? roller.startRest(restDurationMs) : undefined),
            [roller, state.isResting, restDurationMs],
        );

        useEffect(
            () =>
                phase === "idling"
                    ? roller.drift(defs.idleDelayMs, stepAngle, { x: driftAxis.x, y: driftAxis.y, z: driftAxis.z })
                    : undefined,
            [roller, phase, defs.idleDelayMs, stepAngle, driftAxis.x, driftAxis.y, driftAxis.z],
        );

        useEffect(() => (element ? roller.observe(element) : undefined), [roller, element]);

        return {
            orientation: state.orientation,
            targetFace,
            currentFace: RollerUtils.getClosestFace(defs.faces, state.orientation) ?? 0,
            restingFace: state.restingFace,
            phase,
            faceCount,
            isRotatable,
            isRollable: RollerUtils.getIsRollable(state, isRotatable, defs.computeRollTarget !== undefined),
            isAwaitingTarget: state.isAwaitingTarget,
            isBusy: RollerUtils.getIsBusy(state),
            roll: roller.roll,
            step: roller.step,
        };
    };
}
