import { describe, expect, it } from "vitest";

import { DateValueUtils } from "../../../Abstracts/DateValue/DateValue.utils";
import { DateInputUtils } from "./DateInput.utils";

const date = (iso: string) => DateValueUtils.fromIso(iso)!;

const parse = (digits: string, format: "iso" | "day_month_year" = "iso") =>
    DateInputUtils.parseDigits(digits, { format, calendar: "gregory", era: "AD" });

describe("DateInputUtils masks and hints", () => {
    it("derives the mask and hint from the format's order", () => {
        expect(DateInputUtils.computeMask("iso")).toBe("####-##-##");
        expect(DateInputUtils.computeMask("day_month_year")).toBe("##/##/####");
        expect(DateInputUtils.computeHint("month_day_year", { year: "yyyy", month: "mm", day: "dd" })).toBe(
            "mm/dd/yyyy",
        );
    });

    it("writes a date as digits in the format's order", () => {
        expect(DateInputUtils.toDigits(date("2026-12-25"), "day_month_year")).toBe("25122026");
    });
});

describe("DateInputUtils.parseDigits", () => {
    it("reads a complete date in either order", () => {
        expect(DateValueUtils.toIso(parse("20261225")!)).toBe("2026-12-25");
        expect(DateValueUtils.toIso(parse("25122026", "day_month_year")!)).toBe("2026-12-25");
    });

    it("refuses a date that does not exist rather than nudging it", () => {
        expect(parse("20260231")).toBeUndefined();
        expect(parse("31022026", "day_month_year")).toBeUndefined();
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

    it("refuses a day the consumer refuses, by description or by rule, and reads the days beside it", () => {
        const opts = {
            format: "iso" as const,
            calendar: "gregory" as const,
            era: "AD",
            disabledDays: [{ daysOfWeek: [0, 6] }],
            computeIsDayDisabled: (day: ReturnType<typeof date>) => DateValueUtils.toIso(day) === "2026-08-12",
        };

        expect(DateInputUtils.parseDigits("20260809", opts)).toBeUndefined();
        expect(DateInputUtils.parseDigits("20260812", opts)).toBeUndefined();
        expect(DateValueUtils.toIso(DateInputUtils.parseDigits("20260811", opts)!)).toBe("2026-08-11");
    });

    it("refuses the same day whichever calendar it is typed in", () => {
        const refused = date("2026-08-11");
        const hebrew = DateValueUtils.withCalendar(refused, "hebrew");
        const digits = DateInputUtils.toDigits(hebrew, "iso");

        expect(
            DateInputUtils.parseDigits(digits, { format: "iso", calendar: "hebrew", era: hebrew.era }),
        ).toBeDefined();
        expect(
            DateInputUtils.parseDigits(digits, {
                format: "iso",
                calendar: "hebrew",
                era: hebrew.era,
                disabledDays: [refused],
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
