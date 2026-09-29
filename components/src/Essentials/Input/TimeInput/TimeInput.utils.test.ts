import { describe, expect, it } from "vitest";

import { TimeInputUtils } from "./TimeInput.utils";

const parse = (digits: string, isTwelveHour = false, meridiem: "am" | "pm" = "am") =>
    TimeInputUtils.parseDigits(digits, { segmentCount: 2, isTwelveHour, meridiem });

describe("TimeInputUtils segments", () => {
    it("finds the segment from the caret, three characters to a segment", () => {
        expect(TimeInputUtils.getSegmentAt(0)).toEqual({ unit: "hour", start: 0 });
        expect(TimeInputUtils.getSegmentAt(4)).toEqual({ unit: "minute", start: 3 });
        expect(TimeInputUtils.getSegmentAt(99)).toEqual({ unit: "second", start: 6 });
    });

    it("masks two or three segments", () => {
        expect(TimeInputUtils.computeMask(2)).toBe("##:##");
        expect(TimeInputUtils.computeMask(3)).toBe("##:##:##");
    });
});

describe("TimeInputUtils.parseDigits", () => {
    it("reads a complete time and refuses one that does not exist", () => {
        expect(parse("1445")).toEqual({ hour: 14, minute: 45 });
        expect(parse("2400")).toBeUndefined();
        expect(parse("0960")).toBeUndefined();
    });

    it("reads twelve o'clock as noon in the afternoon and midnight in the morning", () => {
        expect(parse("1200", true, "pm")).toEqual({ hour: 12, minute: 0 });
        expect(parse("1200", true, "am")).toEqual({ hour: 0, minute: 0 });
    });
});

describe("TimeInputUtils.computeStep", () => {
    it("steps the segment the caret is in and selects it", () => {
        expect(TimeInputUtils.computeStep("ArrowUp", { hour: 14, minute: 45 }, 4)).toEqual({
            time: { hour: 14, minute: 46 },
            selectionStart: 3,
            selectionEnd: 5,
        });
    });

    it("wraps around the day and clamps into the bounds", () => {
        expect(TimeInputUtils.computeStep("ArrowUp", { hour: 23, minute: 30 }, 0)?.time).toEqual({
            hour: 0,
            minute: 30,
        });
        expect(
            TimeInputUtils.computeStep("ArrowUp", { hour: 17, minute: 30 }, 0, undefined, { hour: 17, minute: 30 })
                ?.time,
        ).toEqual({ hour: 17, minute: 30 });
    });

    it("does nothing for another key or an empty field", () => {
        expect(TimeInputUtils.computeStep("a", { hour: 1, minute: 0 }, 0)).toBeUndefined();
        expect(TimeInputUtils.computeStep("ArrowUp", undefined, 0)).toBeUndefined();
    });
});
