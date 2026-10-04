import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { OdometerUtils } from "./Odometer.utils";

const spell = (text: string) =>
    OdometerUtils.getSlots(text)
        .map((slot) => `${slot.character}${slot.kind === "digit" ? `#${slot.digitIndex}` : ""}`)
        .join(" ");

describe("getSlots", () => {
    it("numbers the digits and leaves everything else as a slot that never turns", () => {
        expect(spell("1,20")).toBe("1#0 , 2#1 0#2");
    });

    it("treats a currency sign and a decimal point alike, because neither of them turns", () => {
        expect(spell("$1.5")).toBe("$ 1#0 . 5#1");
    });

    it("has no slots at all for an empty string", () => {
        expect(OdometerUtils.getSlots("")).toEqual([]);
    });
});

describe("compareDigits", () => {
    it("reads a bigger number as counting up and a smaller one as counting down", () => {
        expect(OdometerUtils.compareDigits([1, 9, 9], [2, 0, 0])).toBe("up");
        expect(OdometerUtils.compareDigits([2, 0, 0], [1, 9, 9])).toBe("down");
    });

    it("reads a longer number as bigger, whatever its digits are", () => {
        expect(OdometerUtils.compareDigits([9], [1, 0])).toBe("up");
        expect(OdometerUtils.compareDigits([1, 0], [9])).toBe("down");
    });

    it("has nothing to say about a number that has not changed", () => {
        expect(OdometerUtils.compareDigits([4, 2], [4, 2])).toBe("same");
    });
});

describe("compareDigits, with a sign in the text", () => {
    const digits = (text: string) => OdometerUtils.getDigits(OdometerUtils.getSlots(text));

    it("follows the digits rather than the number, because the columns show the magnitude", () => {
        expect(
            OdometerUtils.compareDigits(digits("-1"), digits("-2")),
            "going further below zero turns the columns forward, the short way, not nine steps back",
        ).toBe("up");
        expect(OdometerUtils.compareDigits(digits("-2"), digits("-1")), "and coming back turns them back").toBe("down");
    });

    it("does not turn a column when only the sign changed", () => {
        expect(OdometerUtils.compareDigits(digits("1"), digits("-1"))).toBe("same");
    });

    it("turns them back through zero, because the magnitude is falling either side of it", () => {
        expect(OdometerUtils.compareDigits(digits("2"), digits("-1"))).toBe("down");
        expect(OdometerUtils.compareDigits(digits("-1"), digits("0"))).toBe("down");
    });
});

describe("computeStepDelta", () => {
    it("takes the short way when it is also the way the number is going", () => {
        expect(OdometerUtils.computeStepDelta(1, 2, "up")).toBe(1);
    });

    it("keeps going forward through zero rather than rewinding, which is what a carry looks like", () => {
        expect(OdometerUtils.computeStepDelta(9, 0, "up")).toBe(1);
    });

    it("and keeps going backward through zero when the number is falling", () => {
        expect(OdometerUtils.computeStepDelta(0, 9, "down")).toBe(-1);
    });

    it("turns the long way round when the digit disagrees with the number's direction", () => {
        expect(OdometerUtils.computeStepDelta(0, 9, "up"), "the units of 10 going to 19").toBe(9);
    });

    it("does not move a digit that has not changed", () => {
        expect(OdometerUtils.computeStepDelta(4, 4, "up")).toBe(0);
    });
});

describe("computeAngleDelta", () => {
    it("turns a tenth of a circle per step, in the direction a wheel turns under a fixed marker", () => {
        expect(OdometerUtils.computeAngleDelta(1, 2, "up")).toBe(-36);
        expect(OdometerUtils.computeAngleDelta(2, 1, "down")).toBe(36);
    });
});

describe("computeCascadeDelays", () => {
    it("holds a column back by one beat for every column to its right that is also turning", () => {
        expect(OdometerUtils.computeCascadeDelays([1, 9, 9], [2, 0, 0], 100)).toEqual([200, 100, 0]);
    });

    it("does not hold a column back for a neighbor that is standing still", () => {
        expect(OdometerUtils.computeCascadeDelays([1, 2, 3], [2, 2, 3], 100)).toEqual([0, 0, 0]);
    });

    it("counts only the columns to the right, so the units never wait", () => {
        expect(OdometerUtils.computeCascadeDelays([0, 0], [1, 1], 50)).toEqual([50, 0]);
    });
});

describe("getRestingAngle", () => {
    it("puts the digit it names in front of the reader", () => {
        expect(OdometerUtils.getRestingAngle(0)).toBe(0);
        expect(OdometerUtils.getRestingAngle(1)).toBe(324);
    });
});

describe("computeReelAngle", () => {
    it("adds whole turns the way the number is going, forward being the same sign as a step up", () => {
        expect(OdometerUtils.computeReelAngle(2, "up")).toBe(-720);
        expect(OdometerUtils.computeReelAngle(1, "down")).toBe(360);
    });

    it("adds nothing when no digit changed, so a reel does not spin for a sign alone", () => {
        expect(OdometerUtils.computeReelAngle(3, "same")).toBe(0);
    });
});

describe("computeShownSlots", () => {
    const phases = (shown: { phase: string }[]) => shown.map((entry) => entry.phase);

    it("grows a slot in where the new list is longer", () => {
        const shown = OdometerUtils.computeShownSlots([{ slot: "a", phase: "shown" }], ["a", "b"], false);

        expect(phases(shown)).toEqual(["shown", "entering"]);
    });

    it("keeps a lost slot, holding what it showed, so it can shrink away", () => {
        const shown = OdometerUtils.computeShownSlots(
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
        const shown = OdometerUtils.computeShownSlots(
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
        const shown = OdometerUtils.computeShownSlots([{ slot: "a", phase: "entering" }], ["b"], false);

        expect(phases(shown)).toEqual(["entering"]);
    });

    it("changes the width at once when motion is reduced: nothing enters, nothing lingers", () => {
        const shown = OdometerUtils.computeShownSlots(
            [
                { slot: "a", phase: "shown" },
                { slot: "b", phase: "shown" },
            ],
            ["a"],
            true,
        );

        expect(shown).toEqual([{ slot: "a", phase: "shown" }]);
        expect(phases(OdometerUtils.computeShownSlots([], ["a", "b"], true))).toEqual(["shown", "shown"]);
    });
});

describe("settleShownSlot", () => {
    it("marks a grown slot as shown and leaves the others alone", () => {
        const before = [
            { slot: "a", phase: "shown" as const },
            { slot: "b", phase: "entering" as const },
        ];

        expect(OdometerUtils.settleShownSlot(before, 1)[1].phase).toBe("shown");
        expect(OdometerUtils.settleShownSlot(before, 1)[0]).toBe(before[0]);
    });

    it("does nothing to a slot that is no longer entering", () => {
        const before = [{ slot: "a", phase: "leaving" as const }];

        expect(OdometerUtils.settleShownSlot(before, 0)).toBe(before);
    });
});

describe("dropShownSlot", () => {
    it("cuts the list at a slot that has shrunk away, taking the leaving tail with it", () => {
        const before = [
            { slot: "a", phase: "shown" as const },
            { slot: "b", phase: "leaving" as const },
            { slot: "c", phase: "leaving" as const },
        ];

        expect(OdometerUtils.dropShownSlot(before, 1)).toEqual([{ slot: "a", phase: "shown" }]);
    });

    it("keeps a slot that came back before its shrink ended", () => {
        const before = [{ slot: "a", phase: "entering" as const }];

        expect(OdometerUtils.dropShownSlot(before, 0)).toBe(before);
    });
});

describe("getSlotFlags", () => {
    it("tells the painter which way the slot is going", () => {
        expect(OdometerUtils.getSlotFlags("entering")).toEqual({ isEntering: true, isLeaving: false });
        expect(OdometerUtils.getSlotFlags("shown")).toEqual({ isEntering: false, isLeaving: false });
        expect(OdometerUtils.getSlotFlags("leaving")).toEqual({ isEntering: false, isLeaving: true });
    });
});

describe("getFixedSlots and getDigitSlots", () => {
    it("split the slots into the two kinds, each keeping where it sat among all of them", () => {
        const slots = OdometerUtils.getSlots("1,20");

        expect(OdometerUtils.getFixedSlots(slots)).toEqual([{ character: ",", order: 1 }]);
        expect(OdometerUtils.getDigitSlots(slots)).toEqual([
            { order: 0, digitIndex: 0 },
            { order: 2, digitIndex: 1 },
            { order: 3, digitIndex: 2 },
        ]);
    });
});

describe("computeTurn", () => {
    const base = { isInstant: false, reels: undefined, cascadeDelayMs: 100 };

    it("turns a carrying column on from where it was and cascades from the right", () => {
        const angles = [1, 9, 9].map(OdometerUtils.getRestingAngle);
        const turn = OdometerUtils.computeTurn({
            ...base,
            shownDigits: [1, 9, 9],
            columnDigits: [1, 9, 9],
            angles,
            digits: [2, 0, 0],
        });

        expect(turn.delays).toEqual([200, 100, 0]);
        expect(turn.angles[2]).toBe(angles[2]! - 36);
        expect(turn.columnDigits).toEqual([2, 0, 0]);
    });

    it("keeps a leaving column's angle and digit, unless motion is reduced", () => {
        const args = { ...base, shownDigits: [1, 0], columnDigits: [1, 0], angles: [-36, 0], digits: [9] };

        expect(OdometerUtils.computeTurn(args).angles).toHaveLength(2);
        expect(OdometerUtils.computeTurn(args).columnDigits).toEqual([9, 0]);
        expect(OdometerUtils.computeTurn({ ...args, isInstant: true }).angles).toHaveLength(1);
    });

    it("hands each column its reel's duration and runs no cascade under reels", () => {
        const turn = OdometerUtils.computeTurn({
            ...base,
            shownDigits: [0, 0],
            columnDigits: [0, 0],
            angles: [0, 0],
            digits: [0, 1],
            reels: [
                { extraTurns: 1, durationMs: 500 },
                { extraTurns: 2, durationMs: 900 },
            ],
        });

        expect(turn.delays).toEqual([0, 0]);
        expect(turn.durations).toEqual([500, 900]);
        expect(turn.angles[0]).toBe(-360);
    });
});

describe("getFlapPosition", () => {
    it("reads a resting angle back as a position whose digit is the one the angle shows", () => {
        for (let digit = 0; digit < 10; digit++) {
            const position = OdometerUtils.getFlapPosition(OdometerUtils.getRestingAngle(digit));

            expect(((position % 10) + 10) % 10).toBe(digit);
        }
    });

    it("rises by one flap for each step a turn takes going up, and never wraps", () => {
        const from = OdometerUtils.getRestingAngle(9);
        const to = from + OdometerUtils.computeAngleDelta(9, 0, "up");

        expect(OdometerUtils.getFlapPosition(to) - OdometerUtils.getFlapPosition(from)).toBe(1);
    });

    it("falls the same way going down", () => {
        const from = OdometerUtils.getRestingAngle(0);
        const to = from + OdometerUtils.computeAngleDelta(0, 9, "down");

        expect(OdometerUtils.getFlapPosition(to) - OdometerUtils.getFlapPosition(from)).toBe(-1);
    });

    it("counts a reel's extra turn as a full round of flaps", () => {
        expect(OdometerUtils.getFlapPosition(OdometerUtils.computeReelAngle(1, "up"))).toBe(10);
    });
});

describe("computeFlapRunPosition", () => {
    it("stays at the start while waiting, and lands exactly on the end", () => {
        expect(OdometerUtils.computeFlapRunPosition(2, 6, 50, 100, 400)).toBe(2);
        expect(OdometerUtils.computeFlapRunPosition(2, 6, 500, 100, 400)).toBe(6);
        expect(OdometerUtils.computeFlapRunPosition(0.3, 6, 900, 100, 400)).toBe(6);
    });

    it("moves at a steady rate once started, either way", () => {
        expect(OdometerUtils.computeFlapRunPosition(2, 6, 300, 100, 400)).toBe(4);
        expect(OdometerUtils.computeFlapRunPosition(6, 2, 300, 100, 400)).toBe(4);
    });

    it("jumps once the wait is over when there is no duration", () => {
        expect(OdometerUtils.computeFlapRunPosition(2, 6, 99, 100, 0)).toBe(2);
        expect(OdometerUtils.computeFlapRunPosition(2, 6, 100, 100, 0)).toBe(6);
    });
});

describe("getDrawnFlapPosition", () => {
    it("leaves a whole position where it is", () => {
        expect(OdometerUtils.getDrawnFlapPosition(3)).toBe(3);
        expect(OdometerUtils.getDrawnFlapPosition(-4)).toBe(-4);
    });

    it("keeps each flap inside its own step, and keeps the middle of a flap in the middle", () => {
        expect(OdometerUtils.getDrawnFlapPosition(3.5)).toBe(3.5);
        expect(OdometerUtils.getDrawnFlapPosition(3.25)).toBeGreaterThan(3);
        expect(OdometerUtils.getDrawnFlapPosition(3.25)).toBeLessThan(3.25);
        expect(OdometerUtils.getDrawnFlapPosition(3.75)).toBeGreaterThan(3.75);
        expect(OdometerUtils.getDrawnFlapPosition(3.75)).toBeLessThan(4);
    });

    it("never runs backwards as the run goes on", () => {
        let previous = OdometerUtils.getDrawnFlapPosition(0);

        for (let step = 1; step <= 40; step++) {
            const drawn = OdometerUtils.getDrawnFlapPosition(step / 10);

            expect(drawn).toBeGreaterThanOrEqual(previous);
            previous = drawn;
        }
    });
});

describe("getFlapWindow", () => {
    it("draws the flap that fell last, the one on show and the next, standing on the one on show", () => {
        expect(OdometerUtils.getFlapWindow(13)).toEqual({
            leaves: [
                { front: "2", back: "3" },
                { front: "3", back: "4" },
                { front: "4", back: "5" },
            ],
            position: 1,
        });
    });

    it("wraps from nine to zero and below zero", () => {
        expect(OdometerUtils.getFlapWindow(9.5).leaves[1]).toEqual({ front: "9", back: "0" });
        expect(OdometerUtils.getFlapWindow(-0.25)).toEqual({
            leaves: [
                { front: "8", back: "9" },
                { front: "9", back: "0" },
                { front: "0", back: "1" },
            ],
            position: 1.75,
        });
    });

    it("shows the same halves either side of a whole position", () => {
        const landing = OdometerUtils.getFlapWindow(3.999999);
        const landed = OdometerUtils.getFlapWindow(4);

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
        const flapper = OdometerUtils.createFlapper(0);

        flapper.flapTo(4, 0, 400);
        runFrame(100);

        expect(flapper.get()).toBe(1);

        runFrame(400);

        expect(flapper.get()).toBe(4);
        expect(frames).toHaveLength(0);
    });

    it("does nothing when asked for the position it is resting on", () => {
        const flapper = OdometerUtils.createFlapper(2);
        const heard: number[] = [];

        flapper.subscribe(() => heard.push(flapper.get()));
        flapper.flapTo(2, 0, 400);

        expect(frames).toHaveLength(0);
        expect(heard).toEqual([]);
    });

    it("starts a new run from where the last one had reached", () => {
        const flapper = OdometerUtils.createFlapper(0);

        flapper.flapTo(4, 0, 400);
        runFrame(200);
        flapper.flapTo(0, 0, 200);
        runFrame(300);

        expect(flapper.get()).toBe(1);
    });

    it("waits out its delay before moving", () => {
        const flapper = OdometerUtils.createFlapper(0);

        flapper.flapTo(2, 100, 200);
        runFrame(50);

        expect(flapper.get()).toBe(0);
    });

    it("puts the position straight on with neither a wait nor a duration", () => {
        const flapper = OdometerUtils.createFlapper(0);

        flapper.flapTo(7, 0, 0);

        expect(flapper.get()).toBe(7);
        expect(frames).toHaveLength(0);
    });

    it("rests and stops on request", () => {
        const flapper = OdometerUtils.createFlapper(0);

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
