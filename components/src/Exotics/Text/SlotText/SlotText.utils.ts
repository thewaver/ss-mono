import { MathUtils, RotationUtils, StoreUtils } from "@thewaver/ss-utils";

import type {
    SlotTextDirection,
    SlotTextFixedSlot,
    SlotTextFlapLeaf,
    SlotTextFlapWindow,
    SlotTextFlapper,
    SlotTextLetterRoute,
    SlotTextReel,
    SlotTextShownSlot,
    SlotTextSlot,
    SlotTextSlotFlags,
    SlotTextSlotPhase,
    SlotTextTurn,
    SlotTextTurningSlot,
    SlotTextWheel,
} from "./SlotText.types";

/** Digits on a wheel. */
const DIGIT_COUNT = 10;
/** Zero, as an index. */
const NOTHING = 0;
/** One digit or one step. */
const SINGLE = 1;
/** Half, for the shortest way round a column. */
const HALF = 0.5;
/** Marks a slot that does not turn, and seeds the wheel count so the first wheel is numbered zero. */
const NO_WHEEL = -1;
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
 * Works out how a slot text's columns should turn to reach new text.
 *
 * A column is a wheel of characters: the ten digits, or the letters the consumer lists. The awkward part is the
 * digits, which are not independent. A wheel turning from `9` to `0` should carry on forwards rather than winding
 * back nine places, and a number should read as one mechanism — so which way its wheels turn is decided from the
 * number as a whole, the way a mechanical odometer behaves. A letter belongs to no number, so each letter column
 * turns on its own, forward round its letters or the shortest way, as the consumer asks. Either way the columns
 * start one after another rather than all at once.
 */
export namespace SlotTextUtils {
    /** The digits in the order they appear around a wheel, which is what a slot's barrel is handed as its faces. */
    export const DIGITS = DIGIT_FACES;

    /**
     * Splits text into the wheels that turn and the characters that do not.
     *
     * Digits always get wheels, and so does any character in `letters`. Everything else — separators, currency
     * symbols, and letters nobody listed — stays put. Each turning slot carries its number among the turning slots,
     * which is what the cascade, the reels and the comparison are keyed on, so inserting a separator does not
     * disturb them.
     *
     * @param text The text to show.
     * @param letters The characters a letter column holds, in the order they sit round it. Empty turns no letters.
     */
    export const getSlots = (text: string, letters = ""): SlotTextSlot[] => {
        let wheelIndex = NO_WHEEL;

        return Array.from(text).map((character) => {
            const isDigit = character >= "0" && character <= "9";
            const isLetter = !isDigit && letters.includes(character);

            if (isDigit || isLetter) wheelIndex += SINGLE;

            return {
                kind: isDigit ? "digit" : isLetter ? "letter" : "fixed",
                character,
                wheelIndex: isDigit || isLetter ? wheelIndex : NO_WHEEL,
            };
        });
    };

    /**
     * What each turning slot shows, as a face on its wheel.
     *
     * @param slots What {@link getSlots} gives.
     * @param letters The same letters {@link getSlots} was given.
     * @returns One wheel per turning slot, in order.
     */
    export const getWheels = (slots: SlotTextSlot[], letters = ""): SlotTextWheel[] => {
        const letterFaces = Array.from(letters);

        return slots.flatMap((slot): SlotTextWheel[] => {
            if (slot.kind === "fixed") return [];

            const faces = slot.kind === "digit" ? DIGIT_FACES : letterFaces;

            return [{ faces, face: faces.indexOf(slot.character), isDigit: slot.kind === "digit" }];
        });
    };

    /** The digit values among a list of wheels, letters dropped, which is what a number's direction is read from. */
    export const getDigits = (wheels: SlotTextWheel[]) =>
        wheels.filter((wheel) => wheel.isDigit).map((wheel) => wheel.face);

    /**
     * Whether two wheels carry the same characters, so one can turn into the other rather than being replaced.
     *
     * @param first One wheel's faces.
     * @param second The other's.
     */
    export const getIsSameFaces = (first: string[], second: string[]) =>
        first === second || (first.length === second.length && first.every((face, index) => face === second[index]));

    /**
     * Whether two wheels show the same thing: the same face, on wheels with the same characters round them.
     *
     * @param first One wheel, or `undefined` for none.
     * @param second The other.
     */
    export const getIsSameWheel = (first: SlotTextWheel | undefined, second: SlotTextWheel | undefined) =>
        first !== undefined &&
        second !== undefined &&
        first.face === second.face &&
        getIsSameFaces(first.faces, second.faces);

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
    export const compareDigits = (previous: number[], next: number[]): SlotTextDirection => {
        if (previous.length !== next.length) return next.length > previous.length ? "up" : "down";

        for (let index = NOTHING; index < next.length; index++) {
            if (next[index] === previous[index]) continue;

            return next[index] > previous[index] ? "up" : "down";
        }

        return "same";
    };

    /**
     * The angle a wheel sits at to show a face.
     *
     * @param face Which face to show.
     * @param faceCount How many faces the wheel has; ten, for a digit, when left out.
     */
    export const getRestingAngle = (face: number, faceCount = DIGIT_COUNT) =>
        RotationUtils.getIndexAngle(face, faceCount);

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
    export const computeStepDelta = (previous: number, next: number, direction: SlotTextDirection) => {
        if (direction === "down") return -(((previous - next) % DIGIT_COUNT) + DIGIT_COUNT) % DIGIT_COUNT;

        return (((next - previous) % DIGIT_COUNT) + DIGIT_COUNT) % DIGIT_COUNT;
    };

    /**
     * How many places a letter column turns, which belongs to no number and so has no direction but its own.
     *
     * @param previous The face shown.
     * @param next The face to show.
     * @param faceCount How many letters the column holds.
     * @param route `"forward"` always turns on round the letters, as a departures board does, so C to Z passes every
     * letter between; `"shortest"` takes the nearer way, so C to Z goes back three.
     * @returns The number of places, negative when turning back.
     */
    export const computeLetterStepDelta = (
        previous: number,
        next: number,
        faceCount: number,
        route: SlotTextLetterRoute,
    ) => {
        const forward = MathUtils.wrapIndex(next - previous, faceCount);

        return route === "shortest" && forward > faceCount * HALF ? forward - faceCount : forward;
    };

    /**
     * How far a wheel turns for a number of places, in degrees.
     *
     * @param steps How many places, negative when turning back.
     * @param faceCount How many faces the wheel has.
     */
    export const computeTurnAngle = (steps: number, faceCount: number) =>
        -steps * RotationUtils.getStepAngle(faceCount);

    /**
     * When each wheel should start turning.
     *
     * A wheel waits for every changing wheel to its right, so the movement runs from the last column
     * towards the first — which is how a mechanical odometer behaves, the tens only moving once the units
     * have come round. Wheels that are not changing are not counted, so a jump from `199` to `299`
     * does not sit waiting on two wheels that are not going to move.
     *
     * @param isChanging Whether each wheel is changing, in order.
     * @param delayMs How long one wheel waits behind the next.
     * @returns One delay per wheel, in the same order.
     */
    export const computeCascadeDelays = (isChanging: boolean[], delayMs: number) =>
        isChanging.map((_unused, index) => isChanging.slice(index + SINGLE).filter(Boolean).length * delayMs);

    /**
     * How far a reel's extra whole turns carry a wheel, in degrees.
     *
     * The turns go the way the whole display is going, so a reel spinning up lands on its digit still moving
     * forward rather than doubling back. Added on top of {@link computeTurnAngle}, which is what gets the
     * wheel to its digit.
     *
     * @param extraTurns How many whole turns to add.
     * @param direction Which way the display is turning.
     * @returns The extra angle, negative going up as the step angles are, and nothing when nothing changed.
     */
    export const computeReelAngle = (extraTurns: number, direction: SlotTextDirection) => {
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
        shown: SlotTextShownSlot<S>[],
        next: S[],
        isInstant: boolean,
    ): SlotTextShownSlot<S>[] => {
        const kept = next.map((slot, index): SlotTextShownSlot<S> => {
            const previous = shown[index];

            if (isInstant) return { slot, phase: "shown" };

            if (previous === undefined || previous.phase === "leaving") return { slot, phase: "entering" };

            return { slot, phase: previous.phase };
        });

        if (isInstant) return kept;

        const leaving = shown
            .slice(next.length)
            .map((entry): SlotTextShownSlot<S> => ({ slot: entry.slot, phase: "leaving" }));

        return [...kept, ...leaving];
    };

    /**
     * Marks an entering slot as fully shown, once it has grown to its width.
     *
     * @param shown The slots on show.
     * @param index The slot that has finished growing.
     * @returns The same list with that slot shown, or the list untouched when the slot is no longer entering.
     */
    export const settleShownSlot = <S>(shown: SlotTextShownSlot<S>[], index: number) =>
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
    export const dropShownSlot = <S>(shown: SlotTextShownSlot<S>[], index: number) =>
        shown[index]?.phase === "leaving" ? shown.slice(NOTHING, index) : shown;

    /**
     * What a slot's painter is told about its phase.
     *
     * @param phase Whether the slot is entering, shown or leaving.
     */
    export const getSlotFlags = (phase: SlotTextSlotPhase): SlotTextSlotFlags => ({
        isEntering: phase === "entering",
        isLeaving: phase === "leaving",
    });

    /**
     * The slots that never turn, each with where it sits among all of them.
     *
     * @param slots What {@link getSlots} gives.
     */
    export const getFixedSlots = (slots: SlotTextSlot[]) =>
        slots.flatMap((slot, order): SlotTextFixedSlot[] =>
            slot.kind === "fixed" ? [{ character: slot.character, order }] : [],
        );

    /**
     * The slots that turn, each with where it sits among all of them and which wheel it is.
     *
     * @param slots What {@link getSlots} gives.
     */
    export const getTurningSlots = (slots: SlotTextSlot[]) =>
        slots.flatMap((slot, order): SlotTextTurningSlot[] =>
            slot.kind === "fixed" ? [] : [{ order, wheelIndex: slot.wheelIndex }],
        );

    /**
     * How every column turns when the text changes.
     *
     * The digits turn the way their number goes, decided from the number as a whole ({@link compareDigits}); each
     * letter column turns its own way, by `letterRoute` ({@link computeLetterStepDelta}). A column showing the same
     * kind of wheel as before turns from its current angle by what it takes to reach its new face, plus whatever
     * extra turns its reel asks for, in the direction it is turning; a column that has just arrived, or has changed
     * from a digit to a letter or back, starts at rest on its face. Columns the new text no longer has keep their
     * angle and what they showed, so they can shrink away still showing it — except with `isInstant`, when they are
     * simply gone and no reel adds turns. The cascade runs only without reels and only when something changed, and
     * nothing turns when nothing did.
     *
     * @param opts.shownWheels What the text showed before this change.
     * @param opts.columnWheels What each column shows now, leaving columns included.
     * @param opts.angles The angle each column is drawn at now.
     * @param opts.wheels What to show.
     * @param opts.isInstant Whether the visitor has asked for less motion.
     * @param opts.reels What each column's reel says, or `undefined` for every column without reels.
     * @param opts.turnDelayMs How long one column waits behind the next.
     * @param opts.letterRoute Which way round a letter column turns.
     * @returns The new angles, delays, durations and column wheels.
     */
    export const computeTurn = (opts: {
        shownWheels: SlotTextWheel[];
        columnWheels: SlotTextWheel[];
        angles: number[];
        wheels: SlotTextWheel[];
        isInstant: boolean;
        reels: (SlotTextReel | undefined)[] | undefined;
        turnDelayMs: number;
        letterRoute: SlotTextLetterRoute;
    }): SlotTextTurn => {
        const { shownWheels, columnWheels, angles, wheels, isInstant, reels, turnDelayMs, letterRoute } = opts;
        const direction = compareDigits(getDigits(shownWheels), getDigits(wheels));
        const isChanging = wheels.map((wheel, index) => !getIsSameWheel(shownWheels[index], wheel));
        const hasChange =
            direction !== "same" || isChanging.some((changing, index) => changing && !wheels[index].isDigit);

        return {
            delays:
                !hasChange || reels !== undefined
                    ? wheels.map(() => NO_DELAY)
                    : computeCascadeDelays(isChanging, turnDelayMs),
            durations: wheels.map((_wheel, index) => reels?.[index]?.durationMs),
            angles: [
                ...wheels.map((wheel, index) => {
                    const wasShowing = columnWheels[index];
                    const faceCount = wheel.faces.length;

                    if (wasShowing === undefined || !getIsSameFaces(wasShowing.faces, wheel.faces)) {
                        return getRestingAngle(wheel.face, faceCount);
                    }

                    const steps = wheel.isDigit
                        ? computeStepDelta(wasShowing.face, wheel.face, direction)
                        : computeLetterStepDelta(wasShowing.face, wheel.face, faceCount, letterRoute);
                    const wheelDirection: SlotTextDirection = wheel.isDigit
                        ? direction
                        : !hasChange
                          ? "same"
                          : steps < NOTHING
                            ? "down"
                            : "up";
                    const extraTurns = isInstant ? NOTHING : (reels?.[index]?.extraTurns ?? NOTHING);

                    return (
                        (angles[index] ?? NO_ANGLE) +
                        computeTurnAngle(steps, faceCount) +
                        computeReelAngle(extraTurns, wheelDirection)
                    );
                }),
                ...(isInstant ? [] : angles.slice(wheels.length)),
            ],
            columnWheels: isInstant ? wheels : [...wheels, ...columnWheels.slice(wheels.length)],
        };
    };

    /**
     * Animates a slot's width as it grows in or shrinks away.
     *
     * The width runs from nothing to one character's width while entering and back while leaving, over the turn's
     * duration. A leaving slot holds at nothing once it gets there, so it does not flash back to full width before
     * it is removed. An animation already running is stopped, and the new one starts from the width the slot is
     * drawn at, so a slot that turns round halfway does not jump.
     *
     * @param element The slot.
     * @param phase Whether the slot is entering or leaving. A shown slot is left alone.
     * @param current The animation running on the slot, if any.
     * @param widthPx One character's width.
     * @param durationMs How long the change takes.
     * @param onFinish Runs once the width has arrived.
     * @returns The animation now running, or `current` untouched for a shown slot.
     */
    export const animateSlotWidth = (
        element: HTMLElement,
        phase: SlotTextSlotPhase,
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
     * @param faceCount How many characters the column holds; ten, for a digit, when left out.
     * @returns How many flaps along the column is, rising as the column turns forward. Its character is the count
     * wrapped into the column's faces.
     */
    export const getFlapPosition = (angle: number, faceCount = DIGIT_COUNT) =>
        Math.round(-angle / RotationUtils.getStepAngle(faceCount));

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
     * @param faces The characters round the column; the ten digits when left out.
     */
    export const getFlapWindow = (position: number, faces: string[] = DIGIT_FACES): SlotTextFlapWindow => {
        const whole = Math.floor(position);

        return {
            leaves: LEAF_OFFSETS.map((offset): SlotTextFlapLeaf => ({
                front: faces[MathUtils.wrapIndex(whole + offset, faces.length)],
                back: faces[MathUtils.wrapIndex(whole + offset + SINGLE, faces.length)],
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
    export const createFlapper = (position: number): SlotTextFlapper => {
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
