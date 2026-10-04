import { untrack } from "svelte";

import { ROLLER_DEFAULTS, RollerUtils } from "@thewaver/ss-components";
import { RotationUtils } from "@thewaver/ss-utils";

import { watchChange } from "../../Utils/effectUtils.svelte.js";
import { readStore } from "../../Utils/storeUtils.js";
import { InteractionTrackerSvelteUtils } from "../InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
import { SignalMirrorSvelteUtils } from "../SignalMirror/SignalMirrorSvelte.utils.svelte.js";
import type { RollerDefs } from "./RollerSvelte.types.js";

/** The Svelte side of {@link RollerUtils}: one solid driven from getters and read back as getters. */
export namespace RollerSvelteUtils {
    /**
     * Drives one solid of faces.
     *
     * {@link RollerUtils.createRoller} with its inputs read from getters, its state read as getters, and its timers
     * following them: the rest after a landing, idle drift while the solid is idling, a consumer's own write to the
     * target face settling the solid there, a change of faces answered by `reshape`, and the drag and the arrow keys
     * attached to the element while it exists. Idle drift stops on its own while the tab is in the background, during
     * the rest after a landing, and whenever the solid cannot turn at all. The solid starts on the target face.
     *
     * Must run while a component is being set up.
     *
     * @param getElement The element that takes the drag and the keys.
     * @param getIsDisabled Whether the solid may turn.
     * @param defs.getFaces The faces, by the direction each points and the direction that reads as down on it.
     * @param defs.getRadius How large the solid is drawn, center to corner, in pixels.
     * @param defs.targetFace The face the solid is heading for or last landed on, if the consumer wants to drive or
     * observe it. Writing it settles the solid there, unless something is under way; the roller writes it as soon as
     * a roll's result is known, and when a drag or a step chooses a face. A value of its own is used when omitted.
     * @param defs.getIsAutoSpinEnabled Whether idle drift is allowed. On when omitted.
     * @param defs.getIdleDelayMs How long one step of idle drift takes, a step being a turn about the drift axis by a
     * full turn shared among the faces. `undefined` means no drift.
     * @param defs.getDriftAxis The axis on screen idle drift turns about.
     * @param defs.getIsMovable Whether the drag and the arrow keys turn the solid.
     * @param defs.computeRollTarget Chooses the face a roll lands on, and may answer later. Without it `roll`
     * declines. Its presence is read at each roll.
     * @returns `getOrientation` for the transform, `getTargetFace`, `getCurrentFace` for the face nearest the viewer
     * right now, `getRestingFace` for the face it rests on, `undefined` while it turns, `getPhase`, `getFaceCount`,
     * `getIsRotatable`, `getIsRollable` for enabling a control, `getIsAwaitingTarget`, `getIsBusy` for a turn somebody
     * started, and the commands `roll` and `step`.
     */
    export const createRoller = (
        getElement: () => HTMLElement | null | undefined,
        getIsDisabled: () => boolean,
        defs: RollerDefs,
    ) => {
        const targetFacePair = SignalMirrorSvelteUtils.createOptional(() => defs.targetFace, 0);
        const [getRawTargetFace] = targetFacePair;

        const faces = $derived(defs.getFaces());
        const faceCount = $derived(faces.length);
        const targetFace = $derived(RollerUtils.clampFace(getRawTargetFace(), faceCount));
        const stepAngle = $derived(RotationUtils.getStepAngle(faceCount));
        const restDurationMs = $derived(defs.getRestDurationMs?.() ?? ROLLER_DEFAULTS.restDurationMs);
        const idleDelayMs = $derived(defs.getIdleDelayMs?.());
        const driftAxis = $derived(defs.getDriftAxis?.() ?? ROLLER_DEFAULTS.driftAxis);

        const roller = RollerUtils.createRoller({
            getIsDisabled,
            getFaces: () => faces,
            getRollDurationMs: () => defs.getRollDurationMs?.() ?? ROLLER_DEFAULTS.rollDurationMs,
            getSettleDurationMs: () => defs.getSettleDurationMs?.() ?? ROLLER_DEFAULTS.settleDurationMs,
            getTumbleCount: () => defs.getTumbleCount?.() ?? ROLLER_DEFAULTS.tumbleCount,
            getMomentumMs: () => defs.getMomentumMs?.() ?? ROLLER_DEFAULTS.momentumMs,
            getRadius: () => defs.getRadius(),
            getIsMovable: () => defs.getIsMovable?.() ?? false,
            targetFace: targetFacePair,
            get computeRollTarget() {
                return defs.computeRollTarget;
            },
            computeFaceLabel: (index, count) => defs.computeFaceLabel(index, count),
            onRollEnd: (index) => defs.onRollEnd?.(index),
        });

        roller.rest(untrack(() => targetFace));

        $effect(() => roller.stop);

        const getOrientation = readStore(roller, (state) => state.orientation);
        const getRollPhase = readStore(roller, (state) => state.rollPhase);
        const getIsAwaitingTarget = readStore(roller, (state) => state.isAwaitingTarget);
        const getIsResting = readStore(roller, (state) => state.isResting);
        const getRestingFace = readStore(roller, (state) => state.restingFace);

        const getIsPageHidden = InteractionTrackerSvelteUtils.trackPageHidden();

        const isRotatable = $derived(RollerUtils.getIsRotatable(getIsDisabled(), faceCount));

        const isRollable = $derived(
            isRotatable && defs.computeRollTarget !== undefined && getRollPhase() === "still" && !getIsAwaitingTarget(),
        );

        const phase = $derived(
            RollerUtils.computePhase(
                {
                    orientation: getOrientation(),
                    rollPhase: getRollPhase(),
                    isAwaitingTarget: false,
                    isResting: getIsResting(),
                    restingFace: undefined,
                },
                {
                    idleDelayMs,
                    isIdleAllowed: (defs.getIsAutoSpinEnabled?.() ?? true) && !getIsPageHidden(),
                    isRotatable,
                },
            ),
        );

        const isBusy = $derived(getIsAwaitingTarget() || getRollPhase() !== "still");

        const currentFace = $derived(RollerUtils.getClosestFace(faces, getOrientation()) ?? 0);

        watchChange(
            () => targetFace,
            (index) => roller.turnToTarget(index),
        );

        watchChange(
            () => faces,
            () => roller.reshape(),
        );

        $effect(() => {
            const durationMs = restDurationMs;

            if (!getIsResting()) return;

            return untrack(() => roller.startRest(durationMs));
        });

        $effect(() => {
            const delayMs = idleDelayMs;
            const angle = stepAngle;
            const axis = driftAxis;

            if (phase !== "idling") return;

            return untrack(() => roller.drift(delayMs, angle, axis));
        });

        $effect(() => {
            const element = getElement();

            if (!element) return;

            return untrack(() => roller.observe(element));
        });

        return {
            getOrientation,
            getTargetFace: () => targetFace,
            getCurrentFace: () => currentFace,
            getRestingFace,
            getPhase: () => phase,
            getFaceCount: () => faceCount,
            getIsRotatable: () => isRotatable,
            getIsRollable: () => isRollable,
            getIsAwaitingTarget,
            getIsBusy: () => isBusy,
            roll: roller.roll,
            step: roller.step,
        };
    };
}
