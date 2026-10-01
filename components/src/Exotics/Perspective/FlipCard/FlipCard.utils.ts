import { MathUtils } from "@thewaver/ss-utils";

import type { FlipCardFace, FlipCardTurnDirection } from "./FlipCard.types";

/** A half turn, which is what takes the card from one side to the other. */
const FLIP_ANGLE_DEG = 180;
/** The angle the card lies at with its front showing, before it has ever turned. */
const FRONT_ANGLE_DEG = 0;
/** A card lying flat, leaning neither way. */
const NO_PEEK = 0;
/** No transition, for a card following a lean directly. */
const NO_DURATION = 0;

/** Which way round each turn direction goes, as the sign it puts on the angle. */
const TURN_SIGNS: Record<FlipCardTurnDirection, number> = {
    forward: -1,
    backward: 1,
};

/**
 * Works out the angle a flip card is drawn at: where it rests after each turn, and how far a lean tips it.
 *
 * The resting angle accumulates rather than being read off the side showing, so a card turned the same way twice
 * goes on round instead of rocking back, and the lean is added on top without ever changing which side counts as
 * showing.
 */
export namespace FlipCardUtils {
    /** The card's two sides, in the order its barrel is handed them. */
    export const FACES: readonly FlipCardFace[] = ["front", "back"];

    /**
     * Which side is showing.
     *
     * @param isFlipped Whether the card has been turned over.
     * @returns `back` when it has, `front` otherwise.
     */
    export const getShownFace = (isFlipped: boolean): FlipCardFace => (isFlipped ? "back" : "front");

    /**
     * Which way round a turn goes, as the sign it puts on the angle.
     *
     * A direction the consumer set wins every time. Without one, a turn to the back goes forward and a turn to the
     * front goes backward, so the card retraces the way it came.
     *
     * @param turnDirection The direction the consumer asked for, if any.
     * @param isTurningToBack Whether this turn takes the card to its back.
     * @returns `-1` for forward, `1` for backward.
     */
    export const getTurnSign = (turnDirection: FlipCardTurnDirection | undefined, isTurningToBack: boolean) =>
        TURN_SIGNS[turnDirection ?? (isTurningToBack ? "forward" : "backward")];

    /**
     * Where the card comes to rest after a change of side.
     *
     * The first call, with no previous angle, places the card on the side it starts on. Every later one adds a half
     * turn in the direction {@link getTurnSign} gives, to the angle the card last rested at, so the angle is never
     * wrapped back into a circle.
     *
     * @param previousAngle The angle the card last rested at, or `undefined` before it has rested anywhere.
     * @param isFlipped Whether the card is now turned over.
     * @param turnDirection The direction the consumer asked for, if any.
     * @returns The resting angle, in degrees.
     */
    export const computeRestingAngle = (
        previousAngle: number | undefined,
        isFlipped: boolean,
        turnDirection: FlipCardTurnDirection | undefined,
    ) => {
        if (previousAngle === undefined) return isFlipped ? -FLIP_ANGLE_DEG : FRONT_ANGLE_DEG;

        return previousAngle + getTurnSign(turnDirection, isFlipped) * FLIP_ANGLE_DEG;
    };

    /**
     * The lean, clamped to what it can mean.
     *
     * @param peekRatio The lean the consumer asked for, from `0` flat to `1` turned all the way.
     * @returns The lean between `0` and `1`.
     */
    export const getPeekRatio = (peekRatio: number) => MathUtils.clamp01(peekRatio);

    /**
     * The angle the card is drawn at: its resting angle, tipped by the lean toward the way the next turn would go.
     *
     * @param restingAngle Where the card rests, from {@link computeRestingAngle}.
     * @param isFlipped Whether the card is turned over, which decides which way the next turn would go.
     * @param peekRatio The lean, between `0` and `1`.
     * @param turnDirection The direction the consumer asked for, if any.
     * @returns The angle, in degrees.
     */
    export const computeAngle = (
        restingAngle: number,
        isFlipped: boolean,
        peekRatio: number,
        turnDirection: FlipCardTurnDirection | undefined,
    ) => restingAngle + getTurnSign(turnDirection, !isFlipped) * peekRatio * FLIP_ANGLE_DEG;

    /**
     * How long the card takes to reach the angle it is drawn at.
     *
     * While it leans it follows the lean directly, so the transition is off; lying flat, it turns over the duration
     * the consumer gave.
     *
     * @param peekRatio The lean, between `0` and `1`.
     * @param transitionDurationMs How long a turn takes.
     * @returns The transition's duration.
     */
    export const getTransitionDurationMs = (peekRatio: number, transitionDurationMs: number) =>
        peekRatio === NO_PEEK ? transitionDurationMs : NO_DURATION;
}
