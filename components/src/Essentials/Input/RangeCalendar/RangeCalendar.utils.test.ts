import { describe, expect, it } from "vitest";

import { DateValueUtils } from "../../../Abstracts/DateValue/DateValue.utils";
import { RangeCalendarUtils } from "./RangeCalendar.utils";

const date = (iso: string) => DateValueUtils.fromIso(iso)!;
const iso = DateValueUtils.toIso;

describe("RangeCalendarUtils.computePick", () => {
    it("holds the first press and reports nothing, because half a range is not a range", () => {
        const first = RangeCalendarUtils.computePick(date("2026-08-14"), undefined);

        expect(iso(first.pendingStart!)).toBe("2026-08-14");
        expect(first.range).toBeUndefined();
    });

    it("completes on the second press, ordered whichever end came first", () => {
        const second = RangeCalendarUtils.computePick(date("2026-08-10"), date("2026-08-14"));

        expect(second.pendingStart).toBeUndefined();
        expect(iso(second.range!.start)).toBe("2026-08-10");
        expect(iso(second.range!.end)).toBe("2026-08-14");
    });
});

describe("RangeCalendarUtils while a start is pending", () => {
    const range = { start: date("2026-08-01"), end: date("2026-08-05") };

    it("marks only the pending start, and bands from it to the highlight", () => {
        const pending = date("2026-08-10");

        expect(RangeCalendarUtils.getIsSelected(date("2026-08-10"), pending, range)).toBe(true);
        expect(RangeCalendarUtils.getIsSelected(date("2026-08-01"), pending, range)).toBe(false);
        expect(iso(RangeCalendarUtils.computePaintedRange(date("2026-08-07"), pending, range)!.start)).toBe(
            "2026-08-07",
        );
        expect(iso(RangeCalendarUtils.computeAnchorDay(pending, undefined, range)!)).toBe("2026-08-10");
    });

    it("anchors on the last end pressed once the range is complete", () => {
        expect(iso(RangeCalendarUtils.computeAnchorDay(undefined, date("2026-08-05"), range)!)).toBe("2026-08-05");
        expect(iso(RangeCalendarUtils.computeAnchorDay(undefined, date("2026-08-20"), range)!)).toBe("2026-08-01");
    });
});
