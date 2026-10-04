import { MathUtils, RotationUtils, StoreUtils } from "@thewaver/ss-utils";

import type {
    OdometerDigitSlot,
    OdometerDirection,
    OdometerFixedSlot,
    OdometerFlapLeaf,
    OdometerFlapWindow,
    OdometerFlapper,
    OdometerReel,
    OdometerShownSlot,
    OdometerSlot,
    OdometerSlotFlags,
    OdometerSlotPhase,
    OdometerTurn,
} from "./Odometer.types";

/** Digits on a wheel. */
const DIGIT_COUNT = 10;
/** Zero, as an index. */
const NOTHING = 0;
/** One digit or one step. */
const SINGLE = 1;
/** Marks a slot that is not a digit, and seeds the digit count so the first digit is numbered zero. */
const NO_DIGIT = -1;
/** One whole turn of a wheel, in degrees. */
const FULL_TURN_DEG = 360;
/** No angle at all, for a wheel that makes no extra turns. */
const NO_ANGLE = 0;
/** No wait, for a wheel that starts at once. */
const NO_DELAY = 0;
/** A slot shrunk to nothing. */
const ZERO_WIDTH = "0px";
/** A run of flaps that has not started. */
const RUN_NOT_STARTED = 0;
/** A run of flaps that has finished. */
const RUN_DONE = 1;
/** The weight of the square in the smooth step a flap falls along, `3s² − 2s³`. */
const SMOOTH_STEP_SQUARE = 3;
/** The weight of the cube in the smooth step a flap falls along. */
const SMOOTH_STEP_CUBE = 2;
/** Where the flap on show sits among the three a column draws, after the one that fell last. */
const SHOWN_LEAF = 1;
/** The flaps a column draws, counted from the one on show: the one that fell last, itself, and the next. */
const LEAF_OFFSETS = [-1, 0, 1];

/** The digits in the order they appear around a wheel. */
const DIGIT_FACES = Array.from({ length: DIGIT_COUNT }, (_unused, index) => String(index));

/**
 * Works out how an odometer's digit wheels should turn to reach a new number.
 *
 * The awkward part is that the digits are not independent. A wheel turning from `9` to `0` should
 * carry on forwards rather than winding back nine places, and the whole display should read as one
 * mechanism — so which way the wheels turn is decided from the number as a whole, and the wheels
 * start one after another rather than all at once.
 */
export namespace OdometerUtils {
    /** The digits in the order they appear around a wheel, which is what a slot's barrel is handed as its faces. */
    export const DIGITS = DIGIT_FACES;

    /**
     * Splits text into the wheels that turn and the characters that do not.
     *
     * Separators, currency symbols and letters stay put; only the digits get wheels. Each digit carries
     * its number among the digits, which is what the cascade and the comparison are keyed on, so
     * inserting a separator does not disturb them.
     *
     * @param text The text to show.
     */
    export const getSlots = (text: string): OdometerSlot[] => {
        let digitIndex = NO_DIGIT;

        return Array.from(text).map((character) => {
            const isDigit = character >= "0" && character <= "9";

            if (isDigit) digitIndex += SINGLE;

            return {
                kind: isDigit ? "digit" : "fixed",
                character,
                digitIndex: isDigit ? digitIndex : NO_DIGIT,
            };
        });
    };

    /** The digit values of a slot list, separators dropped. */
    export const getDigits = (slots: OdometerSlot[]) =>
        slots.filter((slot) => slot.kind === "digit").map((slot) => Number(slot.character));

    /**
     * Which way the wheels should turn to get from one number to another.
     *
     * Decided from the number as a whole rather than per digit, so the whole display turns one way — the
     * leftmost digit that differs settles it, and a number that has grown a digit is going up whatever
     * its digits say.
     *
     * @param previous The digits currently shown.
     * @param next The digits to show.
     * @returns `"up"`, `"down"`, or `"same"` when nothing has changed.
     */
    export const compareDigits = (previous: number[], next: number[]): OdometerDirection => {
        if (previous.length !== next.length) return next.length > previous.length ? "up" : "down";

        for (let index = NOTHING; index < next.length; index++) {
            if (next[index] === previous[index]) continue;

            return next[index] > previous[index] ? "up" : "down";
        }

        return "same";
    };

    /**
     * The angle a wheel sits at to show a digit.
     *
     * @param digit The digit to show.
     */
    export const getRestingAngle = (digit: number) => RotationUtils.getIndexAngle(digit, DIGIT_COUNT);

    /**
     * How many places a wheel turns, in the direction the whole display is going.
     *
     * The direction is what makes this more than a subtraction: going up from `9` to `0` is one place
     * forwards, and going down it is nine places back. Never the short way round, since one wheel
     * turning against the rest reads as broken.
     *
     * @param previous The digit shown.
     * @param next The digit to show.
     * @param direction Which way the display is turning.
     * @returns The number of places, negative when going down.
     */
    export const computeStepDelta = (previous: number, next: number, direction: OdometerDirection) => {
        if (direction === "down") return -(((previous - next) % DIGIT_COUNT) + DIGIT_COUNT) % DIGIT_COUNT;

        return (((next - previous) % DIGIT_COUNT) + DIGIT_COUNT) % DIGIT_COUNT;
    };

    /**
     * How far a wheel turns, in degrees.
     *
     * @param previous The digit shown.
     * @param next The digit to show.
     * @param direction Which way the display is turning.
     */
    export const computeAngleDelta = (previous: number, next: number, direction: OdometerDirection) =>
        -computeStepDelta(previous, next, direction) * RotationUtils.getStepAngle(DIGIT_COUNT);

    /**
     * When each wheel should start turning.
     *
     * A wheel waits for every changing wheel to its right, so the movement runs from the last digit
     * towards the first — which is how a mechanical odometer behaves, the tens only moving once the units
     * have come round. Wheels whose digit is unchanged are not counted, so a jump from `199` to `299`
     * does not sit waiting on two wheels that are not going to move.
     *
     * @param previous The digits currently shown.
     * @param next The digits to show.
     * @param delayMs How long one wheel waits behind the next.
     * @returns One delay per digit, in the same order.
     */
    export const computeCascadeDelays = (previous: number[], next: number[], delayMs: number) =>
        next.map((_unused, index) => {
            const behind = next
                .slice(index + SINGLE)
                .filter((digit, offset) => digit !== previous[index + SINGLE + offset]);

            return behind.length * delayMs;
        });

    /**
     * How far a reel's extra whole turns carry a wheel, in degrees.
     *
     * The turns go the way the whole display is going, so a reel spinning up lands on its digit still moving
     * forward rather than doubling back. Added on top of {@link computeAngleDelta}, which is what gets the
     * wheel to its digit.
     *
     * @param extraTurns How many whole turns to add.
     * @param direction Which way the display is turning.
     * @returns The extra angle, negative going up as the step angles are, and nothing when nothing changed.
     */
    export const computeReelAngle = (extraTurns: number, direction: OdometerDirection) => {
        if (direction === "same") return NO_ANGLE;

        return (direction === "up" ? -extraTurns : extraTurns) * FULL_TURN_DEG;
    };

    /**
     * Which slots are on show once a list of slots has changed, and whether each is arriving or leaving.
     *
     * Slots are matched by position, as the component keys them. A position the new list has and the old one
     * did not is entering; a position the old list had and the new one has lost stays in the list as leaving,
     * holding what it last showed, so it can shrink away before it goes. A leaving slot that the new list
     * fills again is entering once more, which is what lets a shrink turn round halfway. With `isInstant` set
     * nothing enters or leaves: the list is simply the new one, every slot shown.
     *
     * @param shown The slots on show now.
     * @param next The slots the text now asks for.
     * @param isInstant Whether width changes happen at once, for a visitor who has asked for less motion.
     * @returns The slots to show, as long as the longer of the two lists unless `isInstant`.
     */
    export const computeShownSlots = <S>(
        shown: OdometerShownSlot<S>[],
        next: S[],
        isInstant: boolean,
    ): OdometerShownSlot<S>[] => {
        const kept = next.map((slot, index): OdometerShownSlot<S> => {
            const previous = shown[index];

            if (isInstant) return { slot, phase: "shown" };

            if (previous === undefined || previous.phase === "leaving") return { slot, phase: "entering" };

            return { slot, phase: previous.phase };
        });

        if (isInstant) return kept;

        const leaving = shown
            .slice(next.length)
            .map((entry): OdometerShownSlot<S> => ({ slot: entry.slot, phase: "leaving" }));

        return [...kept, ...leaving];
    };

    /**
     * Marks an entering slot as fully shown, once it has grown to its width.
     *
     * @param shown The slots on show.
     * @param index The slot that has finished growing.
     * @returns The same list with that slot shown, or the list untouched when the slot is no longer entering.
     */
    export const settleShownSlot = <S>(shown: OdometerShownSlot<S>[], index: number) =>
        shown[index]?.phase === "entering"
            ? shown.map((entry, position) => (position === index ? { ...entry, phase: "shown" as const } : entry))
            : shown;

    /**
     * Removes a leaving slot, once it has shrunk to nothing.
     *
     * Leaving slots are always the tail of the list, and the ones after this slot started leaving no later than
     * it did, so they go with it.
     *
     * @param shown The slots on show.
     * @param index The slot that has finished shrinking.
     * @returns The list cut short at that slot, or the list untouched when the slot is no longer leaving.
     */
    export const dropShownSlot = <S>(shown: OdometerShownSlot<S>[], index: number) =>
        shown[index]?.phase === "leaving" ? shown.slice(NOTHING, index) : shown;

    /**
     * What a slot's painter is told about its phase.
     *
     * @param phase Whether the slot is entering, shown or leaving.
     */
    export const getSlotFlags = (phase: OdometerSlotPhase): OdometerSlotFlags => ({
        isEntering: phase === "entering",
        isLeaving: phase === "leaving",
    });

    /**
     * The slots that never turn, each with where it sits among all of them.
     *
     * @param slots What {@link getSlots} gives.
     */
    export const getFixedSlots = (slots: OdometerSlot[]) =>
        slots.flatMap((slot, order): OdometerFixedSlot[] =>
            slot.kind === "fixed" ? [{ character: slot.character, order }] : [],
        );

    /**
     * The slots that turn, each with where it sits among all of them and which digit it is.
     *
     * @param slots What {@link getSlots} gives.
     */
    export const getDigitSlots = (slots: OdometerSlot[]) =>
        slots.flatMap((slot, order): OdometerDigitSlot[] =>
            slot.kind === "digit" ? [{ order, digitIndex: slot.digitIndex }] : [],
        );

    /**
     * How every column turns when the number changes.
     *
     * Which way the display goes is decided from the number as a whole ({@link compareDigits}). Each column that
     * was showing a digit turns from its current angle by what it takes to reach its new digit, plus whatever
     * extra turns its reel asks for; a column that has just arrived starts at rest on its digit. Columns the new
     * number no longer has keep their angle and their digit, so they can shrink away still showing it — except
     * with `isInstant`, when they are simply gone and no reel adds turns. The cascade runs only without reels
     * and only when something changed.
     *
     * @param opts.shownDigits The digits the number showed before this change.
     * @param opts.columnDigits The digit each column shows now, leaving columns included.
     * @param opts.angles The angle each column is drawn at now.
     * @param opts.digits The digits to show.
     * @param opts.isInstant Whether the visitor has asked for less motion.
     * @param opts.reels What each column's reel says, or `undefined` for every column without reels.
     * @param opts.cascadeDelayMs How long one column waits behind the next.
     * @returns The new angles, delays, durations and column digits.
     */
    export const computeTurn = (opts: {
        shownDigits: number[];
        columnDigits: number[];
        angles: number[];
        digits: number[];
        isInstant: boolean;
        reels: (OdometerReel | undefined)[] | undefined;
        cascadeDelayMs: number;
    }): OdometerTurn => {
        const { shownDigits, columnDigits, angles, digits, isInstant, reels, cascadeDelayMs } = opts;
        const direction = compareDigits(shownDigits, digits);

        return {
            delays:
                direction === "same" || reels !== undefined
                    ? digits.map(() => NO_DELAY)
                    : computeCascadeDelays(shownDigits, digits, cascadeDelayMs),
            durations: digits.map((_digit, index) => reels?.[index]?.durationMs),
            angles: [
                ...digits.map((digit, index) => {
                    const wasShowing = columnDigits[index];

                    if (wasShowing === undefined) return getRestingAngle(digit);

                    const extraTurns = isInstant ? NOTHING : (reels?.[index]?.extraTurns ?? NOTHING);

                    return (
                        (angles[index] ?? NO_ANGLE) +
                        computeAngleDelta(wasShowing, digit, direction) +
                        computeReelAngle(extraTurns, direction)
                    );
                }),
                ...(isInstant ? [] : angles.slice(digits.length)),
            ],
            columnDigits: isInstant ? digits : [...digits, ...columnDigits.slice(digits.length)],
        };
    };

    /**
     * Animates a slot's width as it grows in or shrinks away.
     *
     * The width runs from nothing to one digit's width while entering and back while leaving, over the turn's
     * duration. A leaving slot holds at nothing once it gets there, so it does not flash back to full width before
     * it is removed. An animation already running is stopped, and the new one starts from the width the slot is
     * drawn at, so a slot that turns round halfway does not jump.
     *
     * @param element The slot.
     * @param phase Whether the slot is entering or leaving. A shown slot is left alone.
     * @param current The animation running on the slot, if any.
     * @param widthPx One digit's width.
     * @param durationMs How long the change takes.
     * @param onFinish Runs once the width has arrived.
     * @returns The animation now running, or `current` untouched for a shown slot.
     */
    export const animateSlotWidth = (
        element: HTMLElement,
        phase: OdometerSlotPhase,
        current: Animation | undefined,
        widthPx: number,
        durationMs: number,
        onFinish: () => void,
    ) => {
        if (phase === "shown") return current;

        const fullWidth = `${widthPx}px`;
        const startWidth =
            current === undefined ? (phase === "entering" ? ZERO_WIDTH : fullWidth) : getComputedStyle(element).width;

        current?.cancel();

        const animation = element.animate(
            [{ width: startWidth }, { width: phase === "entering" ? fullWidth : ZERO_WIDTH }],
            { duration: durationMs, fill: phase === "leaving" ? "forwards" : "none" },
        );

        animation.onfinish = onFinish;

        return animation;
    };

    /**
     * Where a split-flap column stands for the angle a drum column would be turned to, counted in flaps.
     *
     * A drum's angle and a split-flap's position are two spellings of one running count of steps, so a split-flap
     * reuses every rule {@link computeTurn} applies — the direction, the cascade, the reels, the leaving columns —
     * and only reads the answer differently. The count is never wrapped, for the reason the angle is not: a column
     * going from `9` to `0` has to go one flap forward rather than nine back.
     *
     * @param angle An angle {@link computeTurn} or {@link getRestingAngle} gave.
     * @returns How many flaps along the column is, rising as the number goes up. Its digit is the count wrapped
     * into `0`–`9`.
     */
    export const getFlapPosition = (angle: number) => Math.round(-angle / RotationUtils.getStepAngle(DIGIT_COUNT));

    /**
     * How far a run of flaps has gone at a moment, before any flap is eased.
     *
     * The run waits `delayMs`, then moves from `from` to `to` at a steady rate over `durationMs`, so a run of many
     * flaps drops each one faster rather than taking longer. A run with no duration jumps once the wait is over.
     *
     * @param from The position the run starts from, which may be partway through a flap.
     * @param to The position the run ends on.
     * @param elapsedMs How long since the run was asked for.
     * @param delayMs How long the run waits before the first flap moves.
     * @param durationMs How long the run takes once it starts.
     * @returns The position reached, `from` while waiting and `to` once done.
     */
    export const computeFlapRunPosition = (
        from: number,
        to: number,
        elapsedMs: number,
        delayMs: number,
        durationMs: number,
    ) => {
        const progress =
            durationMs > NOTHING
                ? MathUtils.clamp01((elapsedMs - delayMs) / durationMs)
                : elapsedMs >= delayMs
                  ? RUN_DONE
                  : RUN_NOT_STARTED;

        return progress >= RUN_DONE ? to : from + (to - from) * progress;
    };

    /**
     * The position to draw for a position a run has reached, with each flap eased on its own.
     *
     * Every flap starts falling slowly, speeds up and slows again as it lands, so a run reads as one flap after
     * another rather than one smooth slide. Whole positions are left exactly where they are, which is what lets a
     * run be interrupted and restarted from the position reached without the drawing jumping.
     *
     * @param position A position {@link computeFlapRunPosition} gave.
     */
    export const getDrawnFlapPosition = (position: number) => {
        const whole = Math.floor(position);
        const part = position - whole;

        return whole + part * part * (SMOOTH_STEP_SQUARE - SMOOTH_STEP_CUBE * part);
    };

    /**
     * The flaps a split-flap column draws at a drawn position, and where among them it stands.
     *
     * Three flaps are enough to draw any moment, and they are handed out afresh as the column moves, so a column
     * travelling through forty characters still draws three. The one that fell last lies below the middle line and
     * shows the bottom half of the character on show; the one on show carries that character's top half on its front
     * and the next character's bottom half on its back; the next one stands behind it with the next character's top
     * half. Laid out by `SpineUtils.leaves` at the position given, the column reads as one character while the flap
     * is upright and as the next once it has landed, and the picture is the same either side of a whole position.
     *
     * @param position A position {@link getDrawnFlapPosition} gave.
     */
    export const getFlapWindow = (position: number): OdometerFlapWindow => {
        const whole = Math.floor(position);

        return {
            leaves: LEAF_OFFSETS.map((offset): OdometerFlapLeaf => ({
                front: DIGIT_FACES[MathUtils.wrapIndex(whole + offset, DIGIT_COUNT)],
                back: DIGIT_FACES[MathUtils.wrapIndex(whole + offset + SINGLE, DIGIT_COUNT)],
            })),
            position: SHOWN_LEAF + position - whole,
        };
    };

    /**
     * Holds where a split-flap column has reached, and runs it to a new position on animation frames.
     *
     * The position is a running count of flaps, as {@link getFlapPosition} gives it, and it moves at a steady rate;
     * {@link getDrawnFlapPosition} is what eases each flap. A new run asked for partway through another starts from
     * where that one had reached, so nothing jumps. A run with neither a wait nor a duration puts the position
     * straight on.
     *
     * @param position The position to start on.
     * @returns The flapper, whose value is the position reached.
     */
    export const createFlapper = (position: number): OdometerFlapper => {
        const store = StoreUtils.create(position);

        let frame: number | undefined;

        const cancelFrame = () => {
            if (frame !== undefined) cancelAnimationFrame(frame);

            frame = undefined;
        };

        const rest = (next: number) => {
            cancelFrame();
            store.set(next);
        };

        const stop = cancelFrame;

        const flapTo = (target: number, delayMs: number, durationMs: number) => {
            const from = store.get();

            if (frame === undefined && target === from) return;

            if (delayMs <= NOTHING && durationMs <= NOTHING) {
                rest(target);

                return;
            }

            cancelFrame();

            const startMs = performance.now();

            const tick = (nowMs: number) => {
                const reached = computeFlapRunPosition(from, target, nowMs - startMs, delayMs, durationMs);

                store.set(reached);
                frame = reached === target ? undefined : requestAnimationFrame(tick);
            };

            frame = requestAnimationFrame(tick);
        };

        return { get: store.get, subscribe: store.subscribe, flapTo, rest, stop };
    };
}
