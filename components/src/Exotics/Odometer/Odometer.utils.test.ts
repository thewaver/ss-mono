import { describe, expect, it } from "vitest";

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

    it("does not hold a column back for a neighbour that is standing still", () => {
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
