import { describe, expect, it } from "vitest";

import { DateValueUtils } from "../../../Abstracts/DateValue/DateValue.utils";
import { DateInputUtils } from "./DateInput.utils";

const date = (iso: string) => DateValueUtils.fromIso(iso)!;

const parse = (digits: string, format: "iso" | "day-month-year" = "iso") =>
    DateInputUtils.parseDigits(digits, { format, calendar: "gregory", era: "AD" });

describe("DateInputUtils masks and hints", () => {
    it("derives the mask and hint from the format's order", () => {
        expect(DateInputUtils.computeMask("iso")).toBe("####-##-##");
        expect(DateInputUtils.computeMask("day-month-year")).toBe("##/##/####");
        expect(DateInputUtils.computeHint("month-day-year", { year: "yyyy", month: "mm", day: "dd" })).toBe(
            "mm/dd/yyyy",
        );
    });

    it("writes a date as digits in the format's order", () => {
        expect(DateInputUtils.toDigits(date("2026-12-25"), "day-month-year")).toBe("25122026");
    });
});

describe("DateInputUtils.parseDigits", () => {
    it("reads a complete date in either order", () => {
        expect(DateValueUtils.toIso(parse("20261225")!)).toBe("2026-12-25");
        expect(DateValueUtils.toIso(parse("25122026", "day-month-year")!)).toBe("2026-12-25");
    });

    it("refuses a date that does not exist rather than nudging it", () => {
        expect(parse("20260231")).toBeUndefined();
        expect(parse("31022026", "day-month-year")).toBeUndefined();
    });

    it("refuses an incomplete run and a date outside the bounds", () => {
        expect(parse("202612")).toBeUndefined();
        expect(
            DateInputUtils.parseDigits("20260801", {
                format: "iso",
                calendar: "gregory",
                era: "AD",
                minValue: date("2026-08-05"),
            }),
        ).toBeUndefined();
    });
});

describe("DateInputUtils.getHasImpossiblePart", () => {
    const bounds = DateInputUtils.computeBounds(date("2026-08-10"));

    it("refuses a thirteenth month as soon as the month is typed, before any day", () => {
        expect(DateInputUtils.getHasImpossiblePart("202613", "iso", bounds)).toBe(true);
        expect(DateInputUtils.getHasImpossiblePart("20261", "iso", bounds)).toBe(false);
    });

    it("leaves a thirtieth of February to the whole date to refuse", () => {
        expect(DateInputUtils.getHasImpossiblePart("20260230", "iso", bounds)).toBe(false);
    });
});
