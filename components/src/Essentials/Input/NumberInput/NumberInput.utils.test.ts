import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NumberInputUtils } from "./NumberInput.utils";

const GERMAN = { groupSeparator: ".", decimalSeparator: "," };
const FRENCH = { groupSeparator: "\u202f", decimalSeparator: "," };

describe("sanitizeText", () => {
    it("drops anything that cannot appear in a number", () => {
        expect(NumberInputUtils.sanitizeText("12ab34")).toBe("1234");
        expect(NumberInputUtils.sanitizeText("abc")).toBe("");
    });

    it("keeps a half-typed value typeable", () => {
        expect(NumberInputUtils.sanitizeText("-")).toBe("-");
        expect(NumberInputUtils.sanitizeText("1.")).toBe("1.");
        expect(NumberInputUtils.sanitizeText("1e")).toBe("1e");
        expect(NumberInputUtils.sanitizeText("1e-")).toBe("1e-");
    });

    it("allows a sign only where a sign can go", () => {
        expect(NumberInputUtils.sanitizeText("1-2")).toBe("12");
        expect(NumberInputUtils.sanitizeText("+5")).toBe("5");
        expect(NumberInputUtils.sanitizeText("1e+5")).toBe("1e+5");
    });

    it("allows one decimal point and one exponent", () => {
        expect(NumberInputUtils.sanitizeText("1.2.3")).toBe("1.23");
        expect(NumberInputUtils.sanitizeText("1e2e3")).toBe("1e23");
        expect(NumberInputUtils.sanitizeText("1e2.5")).toBe("1e25");
    });

    it("refuses an exponent with no digits in front of it", () => {
        expect(NumberInputUtils.sanitizeText("e5")).toBe("5");
    });

    it("keeps a locale's own separators, and the decimal one only once", () => {
        expect(NumberInputUtils.sanitizeText("1.000,5", GERMAN)).toBe("1.000,5");
        expect(NumberInputUtils.sanitizeText("1,5,5", GERMAN)).toBe("1,55");
    });

    it("keeps a group separator only after a digit of the whole part", () => {
        expect(NumberInputUtils.sanitizeText(".5", GERMAN)).toBe("5");
        expect(NumberInputUtils.sanitizeText("1,5.5", GERMAN)).toBe("1,55");
    });

    it("takes any white space for a locale that groups with a space", () => {
        expect(NumberInputUtils.sanitizeText("1 000", FRENCH)).toBe("1 000");
    });
});

describe("parseValue", () => {
    it("reads a written number", () => {
        expect(NumberInputUtils.parseValue("42")).toBe(42);
        expect(NumberInputUtils.parseValue("-1.5")).toBe(-1.5);
        expect(NumberInputUtils.parseValue("1.")).toBe(1);
    });

    it("reports no value for an empty or half-typed field", () => {
        expect(NumberInputUtils.parseValue("")).toBeUndefined();
        expect(NumberInputUtils.parseValue("-")).toBeUndefined();
        expect(NumberInputUtils.parseValue("1e")).toBeUndefined();
    });

    it("reads a German point as grouping and a German comma as the fraction", () => {
        expect(NumberInputUtils.parseValue("1.000", GERMAN)).toBe(1000);
        expect(NumberInputUtils.parseValue("1,5", GERMAN)).toBe(1.5);
        expect(NumberInputUtils.parseValue("-1.234,5", GERMAN)).toBe(-1234.5);
    });

    it("drops white space grouping under a locale that groups with a space", () => {
        expect(NumberInputUtils.parseValue("1 000,5", FRENCH)).toBe(1000.5);
    });
});

describe("formatValue", () => {
    it("writes the locale's decimal separator and no grouping", () => {
        expect(NumberInputUtils.formatValue(1234.5, GERMAN)).toBe("1234,5");
        expect(NumberInputUtils.formatValue(1234.5)).toBe("1234.5");
    });

    it("writes what reads back as the same number", () => {
        for (const value of [0.1, -2.5, 1e21, 1.5e-7, 123456789]) {
            expect(NumberInputUtils.parseValue(NumberInputUtils.formatValue(value, GERMAN), GERMAN)).toBe(value);
        }
    });
});

describe("getIsInRange", () => {
    it("answers for both ends of the range it is given", () => {
        expect(NumberInputUtils.getIsInRange(5, { min: 10, max: 20 })).toBe(false);
        expect(NumberInputUtils.getIsInRange(25, { min: 10, max: 20 })).toBe(false);
        expect(NumberInputUtils.getIsInRange(15, { min: 10, max: 20 })).toBe(true);
    });

    it("counts the ends themselves as inside", () => {
        expect(NumberInputUtils.getIsInRange(10, { min: 10, max: 20 })).toBe(true);
        expect(NumberInputUtils.getIsInRange(20, { min: 10, max: 20 })).toBe(true);
    });

    it("leaves an open end open", () => {
        expect(NumberInputUtils.getIsInRange(-100, { max: 20 })).toBe(true);
        expect(NumberInputUtils.getIsInRange(100, { min: 10 })).toBe(true);
        expect(NumberInputUtils.getIsInRange(0, {})).toBe(true);
    });
});

describe("clampValue", () => {
    it("holds the value inside the range it is given", () => {
        expect(NumberInputUtils.clampValue(5, { min: 10, max: 20 })).toBe(10);
        expect(NumberInputUtils.clampValue(25, { min: 10, max: 20 })).toBe(20);
        expect(NumberInputUtils.clampValue(15, { min: 10, max: 20 })).toBe(15);
    });

    it("leaves an open end open", () => {
        expect(NumberInputUtils.clampValue(-100, { max: 20 })).toBe(-100);
        expect(NumberInputUtils.clampValue(100, { min: 10 })).toBe(100);
    });
});

describe("computeStep", () => {
    it("moves a whole step from a value already on the ladder", () => {
        expect(NumberInputUtils.computeStep(4, 1, { min: 0, step: 2 })).toBe(6);
        expect(NumberInputUtils.computeStep(4, -1, { min: 0, step: 2 })).toBe(2);
    });

    it("snaps a value between rungs to the next rung in the direction of travel", () => {
        expect(NumberInputUtils.computeStep(3, 1, { min: 0, step: 2 })).toBe(4);
        expect(NumberInputUtils.computeStep(3, -1, { min: 0, step: 2 })).toBe(2);
    });

    it("counts the ladder from min rather than from zero", () => {
        expect(NumberInputUtils.computeStep(-3, 1, { min: -10, step: 2 })).toBe(-2);
        expect(NumberInputUtils.computeStep(-3, -1, { min: -10, step: 2 })).toBe(-4);
    });

    it("does not drift on a fractional step", () => {
        expect(NumberInputUtils.computeStep(0.3, 1, { min: 0, step: 0.1 })).toBe(0.4);
        expect(NumberInputUtils.computeStep(0.3, -1, { min: 0, step: 0.1 })).toBe(0.2);
        expect(NumberInputUtils.computeStep(0.1, 1, { min: 0, step: 0.2 })).toBe(0.2);
    });

    it("lands on the floor when the field is empty", () => {
        expect(NumberInputUtils.computeStep(undefined, 1, { min: 10, step: 5 })).toBe(10);
        expect(NumberInputUtils.computeStep(undefined, -1, { step: 5 })).toBe(0);
    });

    it("stays inside the range", () => {
        expect(NumberInputUtils.computeStep(99, 1, { min: 0, max: 100, step: 5 })).toBe(100);
        expect(NumberInputUtils.computeStep(0, -1, { min: 0, max: 100, step: 5 })).toBe(0);
    });

    it("stands still rather than looping when the step is not a step", () => {
        expect(NumberInputUtils.computeStep(7, 1, { step: 0 })).toBe(7);
    });

    it("moves a whole distance from a value on the ladder", () => {
        expect(NumberInputUtils.computeStep(20, 1, { min: 0, step: 5 }, 50)).toBe(70);
        expect(NumberInputUtils.computeStep(20, -1, { min: 0, step: 5 }, 10)).toBe(10);
    });

    it("counts a distance from the rung behind a value between rungs", () => {
        expect(NumberInputUtils.computeStep(13, 1, { min: 0, step: 5 }, 10)).toBe(20);
        expect(NumberInputUtils.computeStep(13, -1, { min: 0, step: 5 }, 10)).toBe(5);
    });

    it("lands a distance that is not a whole number of steps on the next rung past it", () => {
        expect(NumberInputUtils.computeStep(10, 1, { min: 0, step: 5 }, 7)).toBe(20);
        expect(NumberInputUtils.computeStep(10, -1, { min: 0, step: 5 }, 7)).toBe(0);
    });

    it("holds a distance to the range as a step is held", () => {
        expect(NumberInputUtils.computeStep(95, 1, { min: 0, max: 100, step: 1 }, 10)).toBe(100);
        expect(NumberInputUtils.computeStep(0.3, 1, { min: 0, step: 0.1 }, 0.1 * 10)).toBe(1.3);
    });
});

describe("computePageStep", () => {
    it("takes the distance it is given", () => {
        expect(NumberInputUtils.computePageStep(25, 5)).toBe(25);
    });

    it("moves ten steps when it is given none", () => {
        expect(NumberInputUtils.computePageStep(undefined, 5)).toBe(50);
    });
});

describe("getHasRangeIssue", () => {
    it("flags a number outside the bounds and not one inside", () => {
        expect(NumberInputUtils.getHasRangeIssue(999, { min: 0, max: 100 })).toBe(true);
        expect(NumberInputUtils.getHasRangeIssue(50, { min: 0, max: 100 })).toBe(false);
    });

    it("never flags a field holding no number", () => {
        expect(NumberInputUtils.getHasRangeIssue(undefined, { min: 0, max: 100 })).toBe(false);
    });
});

describe("getIsAtMin and getIsAtMax", () => {
    it("count the bound itself and anything past it", () => {
        expect(NumberInputUtils.getIsAtMin(0, { min: 0 })).toBe(true);
        expect(NumberInputUtils.getIsAtMin(-5, { min: 0 })).toBe(true);
        expect(NumberInputUtils.getIsAtMax(100, { max: 100 })).toBe(true);
        expect(NumberInputUtils.getIsAtMax(99, { max: 100 })).toBe(false);
    });

    it("put an empty field and an open end at neither", () => {
        expect(NumberInputUtils.getIsAtMin(undefined, { min: 0 })).toBe(false);
        expect(NumberInputUtils.getIsAtMax(1e9, {})).toBe(false);
    });
});

describe("computeKeyMove", () => {
    it("steps once on the arrows and a page on PageUp and PageDown", () => {
        expect(NumberInputUtils.computeKeyMove("ArrowUp", {}, 50)).toEqual({ direction: 1 });
        expect(NumberInputUtils.computeKeyMove("ArrowDown", {}, 50)).toEqual({ direction: -1 });
        expect(NumberInputUtils.computeKeyMove("PageUp", {}, 50)).toEqual({ direction: 1, distance: 50 });
        expect(NumberInputUtils.computeKeyMove("PageDown", {}, 50)).toEqual({ direction: -1, distance: 50 });
    });

    it("jumps to a bound only where there is one", () => {
        expect(NumberInputUtils.computeKeyMove("Home", { min: 0, max: 100 }, 10)).toEqual({ value: 0 });
        expect(NumberInputUtils.computeKeyMove("End", { min: 0, max: 100 }, 10)).toEqual({ value: 100 });
        expect(NumberInputUtils.computeKeyMove("Home", {}, 10)).toBeUndefined();
        expect(NumberInputUtils.computeKeyMove("End", {}, 10)).toBeUndefined();
    });

    it("leaves every other key to the text", () => {
        expect(NumberInputUtils.computeKeyMove("5", { min: 0 }, 10)).toBeUndefined();
        expect(NumberInputUtils.computeKeyMove("ArrowLeft", { min: 0 }, 10)).toBeUndefined();
    });
});

describe("computeSettledValue", () => {
    it("pulls a number inside the bounds and leaves an empty field empty", () => {
        expect(NumberInputUtils.computeSettledValue(999, { min: 0, max: 100 })).toBe(100);
        expect(NumberInputUtils.computeSettledValue(50, { min: 0, max: 100 })).toBe(50);
        expect(NumberInputUtils.computeSettledValue(undefined, { min: 0, max: 100 })).toBeUndefined();
    });
});

describe("createStepRepeater", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const makeRepeater = () => NumberInputUtils.createStepRepeater({ getDelayMs: () => 400, getIntervalMs: () => 60 });

    it("steps once at once, and repeats only after the delay", () => {
        const repeater = makeRepeater();
        const step = vi.fn(() => true);

        expect(repeater.start(step)).toBe(true);
        expect(step).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(399);
        expect(step).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(1 + 60 * 3);
        expect(step).toHaveBeenCalledTimes(4);
    });

    it("stops repeating when stopped, and says whether anything was running", () => {
        const repeater = makeRepeater();
        const step = vi.fn(() => true);

        repeater.start(step);

        expect(repeater.stop()).toBe(true);
        expect(repeater.stop()).toBe(false);

        vi.advanceTimersByTime(2000);
        expect(step).toHaveBeenCalledTimes(1);
    });

    it("starts nothing when the first step is refused", () => {
        const repeater = makeRepeater();
        const step = vi.fn(() => false);

        expect(repeater.start(step)).toBe(false);

        vi.advanceTimersByTime(2000);
        expect(step).toHaveBeenCalledTimes(1);
        expect(repeater.stop()).toBe(false);
    });
});
