import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SlotTextUtils } from "./SlotText.utils";

const LETTERS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const spell = (text: string, letters?: string) =>
    SlotTextUtils.getSlots(text, letters)
        .map((slot) => `${slot.character}${slot.kind === "fixed" ? "" : `#${slot.wheelIndex}`}`)
        .join(" ");

const wheelsOf = (text: string, letters?: string) =>
    SlotTextUtils.getWheels(SlotTextUtils.getSlots(text, letters), letters);

describe("getSlots", () => {
    it("numbers the digits and leaves everything else as a slot that never turns", () => {
        expect(spell("1,20")).toBe("1#0 , 2#1 0#2");
    });

    it("treats a currency sign and a decimal point alike, because neither of them turns", () => {
        expect(spell("$1.5")).toBe("$ 1#0 . 5#1");
    });

    it("has no slots at all for an empty string", () => {
        expect(SlotTextUtils.getSlots("")).toEqual([]);
    });

    it("turns a listed letter too, numbering it among every slot that turns", () => {
        expect(spell("GATE 12", LETTERS)).toBe("G#0 A#1 T#2 E#3  #4 1#5 2#6");
    });

    it("leaves a letter nobody listed as a slot that never turns", () => {
        expect(spell("Ab1", "A")).toBe("A#0 b 1#1");
    });
});

describe("getWheels", () => {
    it("puts a digit on the ten digits and a letter on the letters it was given", () => {
        const [letter, digit] = wheelsOf("C3", LETTERS);

        expect(letter).toMatchObject({ face: 3, isDigit: false });
        expect(letter.faces).toHaveLength(LETTERS.length);
        expect(digit).toMatchObject({ face: 3, isDigit: true, faces: SlotTextUtils.DIGITS });
    });
});

describe("compareDigits", () => {
    it("reads a bigger number as counting up and a smaller one as counting down", () => {
        expect(SlotTextUtils.compareDigits([1, 9, 9], [2, 0, 0])).toBe("up");
        expect(SlotTextUtils.compareDigits([2, 0, 0], [1, 9, 9])).toBe("down");
    });

    it("reads a longer number as bigger, whatever its digits are", () => {
        expect(SlotTextUtils.compareDigits([9], [1, 0])).toBe("up");
        expect(SlotTextUtils.compareDigits([1, 0], [9])).toBe("down");
    });

    it("has nothing to say about a number that has not changed", () => {
        expect(SlotTextUtils.compareDigits([4, 2], [4, 2])).toBe("same");
    });
});

describe("compareDigits, with a sign in the text", () => {
    const digits = (text: string) => SlotTextUtils.getDigits(wheelsOf(text));

    it("follows the digits rather than the number, because the columns show the magnitude", () => {
        expect(
            SlotTextUtils.compareDigits(digits("-1"), digits("-2")),
            "going further below zero turns the columns forward, the short way, not nine steps back",
        ).toBe("up");
        expect(SlotTextUtils.compareDigits(digits("-2"), digits("-1")), "and coming back turns them back").toBe("down");
    });

    it("does not turn a column when only the sign changed", () => {
        expect(SlotTextUtils.compareDigits(digits("1"), digits("-1"))).toBe("same");
    });

    it("turns them back through zero, because the magnitude is falling either side of it", () => {
        expect(SlotTextUtils.compareDigits(digits("2"), digits("-1"))).toBe("down");
        expect(SlotTextUtils.compareDigits(digits("-1"), digits("0"))).toBe("down");
    });
});

describe("computeStepDelta", () => {
    it("takes the short way when it is also the way the number is going", () => {
        expect(SlotTextUtils.computeStepDelta(1, 2, "up")).toBe(1);
    });

    it("keeps going forward through zero rather than rewinding, which is what a carry looks like", () => {
        expect(SlotTextUtils.computeStepDelta(9, 0, "up")).toBe(1);
    });

    it("and keeps going backward through zero when the number is falling", () => {
        expect(SlotTextUtils.computeStepDelta(0, 9, "down")).toBe(-1);
    });

    it("turns the long way round when the digit disagrees with the number's direction", () => {
        expect(SlotTextUtils.computeStepDelta(0, 9, "up"), "the units of 10 going to 19").toBe(9);
    });

    it("does not move a digit that has not changed", () => {
        expect(SlotTextUtils.computeStepDelta(4, 4, "up")).toBe(0);
    });
});

describe("computeLetterStepDelta", () => {
    it("always goes forward round the letters on the forward route, the way a departures board does", () => {
        expect(SlotTextUtils.computeLetterStepDelta(3, 26, 27, "forward"), "C to Z passes every letter between").toBe(
            23,
        );
        expect(SlotTextUtils.computeLetterStepDelta(4, 3, 27, "forward"), "D to C goes almost all the way round").toBe(
            26,
        );
    });

    it("takes the nearer way on the shortest route", () => {
        expect(SlotTextUtils.computeLetterStepDelta(3, 26, 27, "shortest"), "C to Z goes back").toBe(-4);
        expect(SlotTextUtils.computeLetterStepDelta(3, 5, 27, "shortest")).toBe(2);
    });
});

describe("computeTurnAngle", () => {
    it("turns one face's share of a circle per step, in the direction a wheel turns under a fixed marker", () => {
        expect(SlotTextUtils.computeTurnAngle(1, 10)).toBe(-36);
        expect(SlotTextUtils.computeTurnAngle(-1, 10)).toBe(36);
    });
});

describe("computeCascadeDelays", () => {
    it("holds a column back by one beat for every column to its right that is also turning", () => {
        expect(SlotTextUtils.computeCascadeDelays([true, true, true], 100)).toEqual([200, 100, 0]);
    });

    it("does not hold a column back for a neighbor that is standing still", () => {
        expect(SlotTextUtils.computeCascadeDelays([true, false, false], 100)).toEqual([0, 0, 0]);
    });

    it("counts only the columns to the right, so the units never wait", () => {
        expect(SlotTextUtils.computeCascadeDelays([true, true], 50)).toEqual([50, 0]);
    });
});

describe("getRestingAngle", () => {
    it("puts the digit it names in front of the reader", () => {
        expect(SlotTextUtils.getRestingAngle(0)).toBe(0);
        expect(SlotTextUtils.getRestingAngle(1)).toBe(324);
    });
});

describe("computeReelAngle", () => {
    it("adds whole turns the way the number is going, forward being the same sign as a step up", () => {
        expect(SlotTextUtils.computeReelAngle(2, "up")).toBe(-720);
        expect(SlotTextUtils.computeReelAngle(1, "down")).toBe(360);
    });

    it("adds nothing when no digit changed, so a reel does not spin for a sign alone", () => {
        expect(SlotTextUtils.computeReelAngle(3, "same")).toBe(0);
    });
});

describe("computeShownSlots", () => {
    const phases = (shown: { phase: string }[]) => shown.map((entry) => entry.phase);

    it("grows a slot in where the new list is longer", () => {
        const shown = SlotTextUtils.computeShownSlots([{ slot: "a", phase: "shown" }], ["a", "b"], false);

        expect(phases(shown)).toEqual(["shown", "entering"]);
    });

    it("keeps a lost slot, holding what it showed, so it can shrink away", () => {
        const shown = SlotTextUtils.computeShownSlots(
            [
                { slot: "a", phase: "shown" },
                { slot: "b", phase: "shown" },
            ],
            ["x"],
            false,
        );

        expect(shown).toEqual([
            { slot: "x", phase: "shown" },
            { slot: "b", phase: "leaving" },
        ]);
    });

    it("turns a leaving slot round when the text asks for it again", () => {
        const shown = SlotTextUtils.computeShownSlots(
            [
                { slot: "a", phase: "shown" },
                { slot: "b", phase: "leaving" },
            ],
            ["a", "c"],
            false,
        );

        expect(shown[1]).toEqual({ slot: "c", phase: "entering" });
    });

    it("still counts a slot as entering if it had not finished growing", () => {
        const shown = SlotTextUtils.computeShownSlots([{ slot: "a", phase: "entering" }], ["b"], false);

        expect(phases(shown)).toEqual(["entering"]);
    });

    it("changes the width at once when motion is reduced: nothing enters, nothing lingers", () => {
        const shown = SlotTextUtils.computeShownSlots(
            [
                { slot: "a", phase: "shown" },
                { slot: "b", phase: "shown" },
            ],
            ["a"],
            true,
        );

        expect(shown).toEqual([{ slot: "a", phase: "shown" }]);
        expect(phases(SlotTextUtils.computeShownSlots([], ["a", "b"], true))).toEqual(["shown", "shown"]);
    });
});

describe("settleShownSlot", () => {
    it("marks a grown slot as shown and leaves the others alone", () => {
        const before = [
            { slot: "a", phase: "shown" as const },
            { slot: "b", phase: "entering" as const },
        ];

        expect(SlotTextUtils.settleShownSlot(before, 1)[1].phase).toBe("shown");
        expect(SlotTextUtils.settleShownSlot(before, 1)[0]).toBe(before[0]);
    });

    it("does nothing to a slot that is no longer entering", () => {
        const before = [{ slot: "a", phase: "leaving" as const }];

        expect(SlotTextUtils.settleShownSlot(before, 0)).toBe(before);
    });
});

describe("dropShownSlot", () => {
    it("cuts the list at a slot that has shrunk away, taking the leaving tail with it", () => {
        const before = [
            { slot: "a", phase: "shown" as const },
            { slot: "b", phase: "leaving" as const },
            { slot: "c", phase: "leaving" as const },
        ];

        expect(SlotTextUtils.dropShownSlot(before, 1)).toEqual([{ slot: "a", phase: "shown" }]);
    });

    it("keeps a slot that came back before its shrink ended", () => {
        const before = [{ slot: "a", phase: "entering" as const }];

        expect(SlotTextUtils.dropShownSlot(before, 0)).toBe(before);
    });
});

describe("getSlotFlags", () => {
    it("tells the painter which way the slot is going", () => {
        expect(SlotTextUtils.getSlotFlags("entering")).toEqual({ isEntering: true, isLeaving: false });
        expect(SlotTextUtils.getSlotFlags("shown")).toEqual({ isEntering: false, isLeaving: false });
        expect(SlotTextUtils.getSlotFlags("leaving")).toEqual({ isEntering: false, isLeaving: true });
    });
});

describe("getFixedSlots and getTurningSlots", () => {
    it("split the slots into the two kinds, each keeping where it sat among all of them", () => {
        const slots = SlotTextUtils.getSlots("1,20");

        expect(SlotTextUtils.getFixedSlots(slots)).toEqual([{ character: ",", order: 1 }]);
        expect(SlotTextUtils.getTurningSlots(slots)).toEqual([
            { order: 0, wheelIndex: 0 },
            { order: 2, wheelIndex: 1 },
            { order: 3, wheelIndex: 2 },
        ]);
    });
});

describe("computeTurn", () => {
    const base = { isInstant: false, reels: undefined, turnDelayMs: 100, letterRoute: "forward" as const };

    const restingAngles = (text: string, letters?: string) =>
        wheelsOf(text, letters).map((wheel) => SlotTextUtils.getRestingAngle(wheel.face, wheel.faces.length));

    it("turns a carrying column on from where it was and cascades from the right", () => {
        const angles = restingAngles("199");
        const turn = SlotTextUtils.computeTurn({
            ...base,
            shownWheels: wheelsOf("199"),
            columnWheels: wheelsOf("199"),
            angles,
            wheels: wheelsOf("200"),
        });

        expect(turn.delays).toEqual([200, 100, 0]);
        expect(turn.angles[2]).toBe(angles[2]! - 36);
        expect(SlotTextUtils.getDigits(turn.columnWheels)).toEqual([2, 0, 0]);
    });

    it("keeps a leaving column's angle and what it showed, unless motion is reduced", () => {
        const args = {
            ...base,
            shownWheels: wheelsOf("10"),
            columnWheels: wheelsOf("10"),
            angles: [-36, 0],
            wheels: wheelsOf("9"),
        };

        expect(SlotTextUtils.computeTurn(args).angles).toHaveLength(2);
        expect(SlotTextUtils.getDigits(SlotTextUtils.computeTurn(args).columnWheels)).toEqual([9, 0]);
        expect(SlotTextUtils.computeTurn({ ...args, isInstant: true }).angles).toHaveLength(1);
    });

    it("hands each column its reel's duration and runs no cascade under reels", () => {
        const turn = SlotTextUtils.computeTurn({
            ...base,
            shownWheels: wheelsOf("00"),
            columnWheels: wheelsOf("00"),
            angles: [0, 0],
            wheels: wheelsOf("01"),
            reels: [
                { extraTurns: 1, durationMs: 500 },
                { extraTurns: 2, durationMs: 900 },
            ],
        });

        expect(turn.delays).toEqual([0, 0]);
        expect(turn.durations).toEqual([500, 900]);
        expect(turn.angles[0]).toBe(-360);
    });

    it("turns each letter its own way, by the route, with no number to follow", () => {
        const args = {
            ...base,
            shownWheels: wheelsOf("CD", LETTERS),
            columnWheels: wheelsOf("CD", LETTERS),
            angles: restingAngles("CD", LETTERS),
            wheels: wheelsOf("ZC", LETTERS),
        };
        const step = 360 / LETTERS.length;

        const forward = SlotTextUtils.computeTurn(args);
        const shortest = SlotTextUtils.computeTurn({ ...args, letterRoute: "shortest" });

        expect(forward.angles[0]).toBeCloseTo(args.angles[0]! - 23 * step);
        expect(forward.angles[1], "D to C goes almost all the way round").toBeCloseTo(args.angles[1]! - 26 * step);
        expect(shortest.angles[0]).toBeCloseTo(args.angles[0]! + 4 * step);
        expect(shortest.angles[1]).toBeCloseTo(args.angles[1]! + step);
        expect(forward.delays, "and the cascade still runs from the right").toEqual([100, 0]);
    });

    it("starts a column at rest when it changes from a digit to a letter", () => {
        const turn = SlotTextUtils.computeTurn({
            ...base,
            shownWheels: wheelsOf("1", LETTERS),
            columnWheels: wheelsOf("1", LETTERS),
            angles: [123],
            wheels: wheelsOf("B", LETTERS),
        });

        expect(turn.angles[0]).toBe(SlotTextUtils.getRestingAngle(2, LETTERS.length));
    });

    it("turns nothing when nothing changed", () => {
        const turn = SlotTextUtils.computeTurn({
            ...base,
            shownWheels: wheelsOf("AB", LETTERS),
            columnWheels: wheelsOf("AB", LETTERS),
            angles: [5, 7],
            wheels: wheelsOf("AB", LETTERS),
            reels: [
                { extraTurns: 1, durationMs: 500 },
                { extraTurns: 1, durationMs: 500 },
            ],
        });

        expect(turn.angles).toEqual([5, 7]);
    });
});

describe("getFlapPosition", () => {
    it("reads a resting angle back as a position whose digit is the one the angle shows", () => {
        for (let digit = 0; digit < 10; digit++) {
            const position = SlotTextUtils.getFlapPosition(SlotTextUtils.getRestingAngle(digit));

            expect(((position % 10) + 10) % 10).toBe(digit);
        }
    });

    it("rises by one flap for each step a turn takes going up, and never wraps", () => {
        const from = SlotTextUtils.getRestingAngle(9);
        const to = from + SlotTextUtils.computeTurnAngle(SlotTextUtils.computeStepDelta(9, 0, "up"), 10);

        expect(SlotTextUtils.getFlapPosition(to) - SlotTextUtils.getFlapPosition(from)).toBe(1);
    });

    it("falls the same way going down", () => {
        const from = SlotTextUtils.getRestingAngle(0);
        const to = from + SlotTextUtils.computeTurnAngle(SlotTextUtils.computeStepDelta(0, 9, "down"), 10);

        expect(SlotTextUtils.getFlapPosition(to) - SlotTextUtils.getFlapPosition(from)).toBe(-1);
    });

    it("counts a reel's extra turn as a full round of flaps", () => {
        expect(SlotTextUtils.getFlapPosition(SlotTextUtils.computeReelAngle(1, "up"))).toBe(10);
    });
});

describe("computeFlapRunPosition", () => {
    it("stays at the start while waiting, and lands exactly on the end", () => {
        expect(SlotTextUtils.computeFlapRunPosition(2, 6, 50, 100, 400)).toBe(2);
        expect(SlotTextUtils.computeFlapRunPosition(2, 6, 500, 100, 400)).toBe(6);
        expect(SlotTextUtils.computeFlapRunPosition(0.3, 6, 900, 100, 400)).toBe(6);
    });

    it("moves at a steady rate once started, either way", () => {
        expect(SlotTextUtils.computeFlapRunPosition(2, 6, 300, 100, 400)).toBe(4);
        expect(SlotTextUtils.computeFlapRunPosition(6, 2, 300, 100, 400)).toBe(4);
    });

    it("jumps once the wait is over when there is no duration", () => {
        expect(SlotTextUtils.computeFlapRunPosition(2, 6, 99, 100, 0)).toBe(2);
        expect(SlotTextUtils.computeFlapRunPosition(2, 6, 100, 100, 0)).toBe(6);
    });
});

describe("getDrawnFlapPosition", () => {
    it("leaves a whole position where it is", () => {
        expect(SlotTextUtils.getDrawnFlapPosition(3)).toBe(3);
        expect(SlotTextUtils.getDrawnFlapPosition(-4)).toBe(-4);
    });

    it("keeps each flap inside its own step, and keeps the middle of a flap in the middle", () => {
        expect(SlotTextUtils.getDrawnFlapPosition(3.5)).toBe(3.5);
        expect(SlotTextUtils.getDrawnFlapPosition(3.25)).toBeGreaterThan(3);
        expect(SlotTextUtils.getDrawnFlapPosition(3.25)).toBeLessThan(3.25);
        expect(SlotTextUtils.getDrawnFlapPosition(3.75)).toBeGreaterThan(3.75);
        expect(SlotTextUtils.getDrawnFlapPosition(3.75)).toBeLessThan(4);
    });

    it("never runs backwards as the run goes on", () => {
        let previous = SlotTextUtils.getDrawnFlapPosition(0);

        for (let step = 1; step <= 40; step++) {
            const drawn = SlotTextUtils.getDrawnFlapPosition(step / 10);

            expect(drawn).toBeGreaterThanOrEqual(previous);
            previous = drawn;
        }
    });
});

describe("getFlapWindow", () => {
    it("draws the flap that fell last, the one on show and the next, standing on the one on show", () => {
        expect(SlotTextUtils.getFlapWindow(13)).toEqual({
            leaves: [
                { front: "2", back: "3" },
                { front: "3", back: "4" },
                { front: "4", back: "5" },
            ],
            position: 1,
        });
    });

    it("wraps from nine to zero and below zero", () => {
        expect(SlotTextUtils.getFlapWindow(9.5).leaves[1]).toEqual({ front: "9", back: "0" });
        expect(SlotTextUtils.getFlapWindow(-0.25)).toEqual({
            leaves: [
                { front: "8", back: "9" },
                { front: "9", back: "0" },
                { front: "0", back: "1" },
            ],
            position: 1.75,
        });
    });

    it("shows the same halves either side of a whole position", () => {
        const landing = SlotTextUtils.getFlapWindow(3.999999);
        const landed = SlotTextUtils.getFlapWindow(4);

        expect(landing.leaves[1].back, "the bottom half the falling flap brings").toBe(landed.leaves[0].back);
        expect(landing.leaves[2].front, "the top half standing behind it").toBe(landed.leaves[1].front);
    });
});

describe("createFlapper", () => {
    let now = 0;
    let frames: ((nowMs: number) => void)[] = [];

    const runFrame = (atMs: number) => {
        now = atMs;

        const due = frames;

        frames = [];
        due.forEach((callback) => callback(atMs));
    };

    beforeEach(() => {
        now = 0;
        frames = [];
        vi.stubGlobal("performance", { now: () => now });
        vi.stubGlobal("requestAnimationFrame", (callback: (nowMs: number) => void) => frames.push(callback));
        vi.stubGlobal("cancelAnimationFrame", (handle: number) => {
            frames = frames.filter((_callback, index) => index !== handle - 1);
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("runs to the target on frames and stops asking for frames once there", () => {
        const flapper = SlotTextUtils.createFlapper(0);

        flapper.flapTo(4, 0, 400);
        runFrame(100);

        expect(flapper.get()).toBe(1);

        runFrame(400);

        expect(flapper.get()).toBe(4);
        expect(frames).toHaveLength(0);
    });

    it("does nothing when asked for the position it is resting on", () => {
        const flapper = SlotTextUtils.createFlapper(2);
        const heard: number[] = [];

        flapper.subscribe(() => heard.push(flapper.get()));
        flapper.flapTo(2, 0, 400);

        expect(frames).toHaveLength(0);
        expect(heard).toEqual([]);
    });

    it("starts a new run from where the last one had reached", () => {
        const flapper = SlotTextUtils.createFlapper(0);

        flapper.flapTo(4, 0, 400);
        runFrame(200);
        flapper.flapTo(0, 0, 200);
        runFrame(300);

        expect(flapper.get()).toBe(1);
    });

    it("waits out its delay before moving", () => {
        const flapper = SlotTextUtils.createFlapper(0);

        flapper.flapTo(2, 100, 200);
        runFrame(50);

        expect(flapper.get()).toBe(0);
    });

    it("puts the position straight on with neither a wait nor a duration", () => {
        const flapper = SlotTextUtils.createFlapper(0);

        flapper.flapTo(7, 0, 0);

        expect(flapper.get()).toBe(7);
        expect(frames).toHaveLength(0);
    });

    it("rests and stops on request", () => {
        const flapper = SlotTextUtils.createFlapper(0);

        flapper.flapTo(4, 0, 400);
        flapper.rest(9);

        expect(flapper.get()).toBe(9);

        flapper.flapTo(1, 0, 400);
        runFrame(200);
        flapper.stop();

        expect(frames).toHaveLength(0);
        expect(flapper.get()).toBe(5);
    });
});
