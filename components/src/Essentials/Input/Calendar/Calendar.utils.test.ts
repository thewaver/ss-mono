import { describe, expect, it } from "vitest";

import { DateValueUtils } from "../../../Abstracts/DateValue/DateValue.utils";
import { CalendarUtils } from "./Calendar.utils";

const date = (iso: string) => DateValueUtils.fromIso(iso)!;
const iso = DateValueUtils.toIso;

describe("getPageStart", () => {
    it("is the first of the month for days and the first of the year for months", () => {
        expect(iso(CalendarUtils.getPageStart(date("2026-08-10"), "day"))).toBe("2026-08-01");
        expect(iso(CalendarUtils.getPageStart(date("2026-08-10"), "month"))).toBe("2026-01-01");
    });

    it("pages years in twelves counted from year 1", () => {
        expect(iso(CalendarUtils.getPageStart(date("2026-08-10"), "year"))).toBe("2017-01-01");
        expect(iso(CalendarUtils.getPageStart(date("2017-01-01"), "year"))).toBe("2017-01-01");
        expect(iso(CalendarUtils.getPageStart(date("2028-12-31"), "year"))).toBe("2017-01-01");
        expect(iso(CalendarUtils.getPageStart(date("2029-01-01"), "year"))).toBe("2029-01-01");
    });
});

describe("getCells and getGridShape", () => {
    it("draws forty-two days in six rows of seven", () => {
        expect(CalendarUtils.getCells(date("2026-08-10"), "day", 1)).toHaveLength(42);
        expect(CalendarUtils.getGridShape(date("2026-08-10"), "day")).toEqual({ rowCount: 6, colCount: 7 });
    });

    it("draws a Gregorian year as twelve months, three by four", () => {
        const cells = CalendarUtils.getCells(date("2026-08-10"), "month", 1);

        expect(cells.map(iso)).toEqual([
            "2026-01-01",
            "2026-02-01",
            "2026-03-01",
            "2026-04-01",
            "2026-05-01",
            "2026-06-01",
            "2026-07-01",
            "2026-08-01",
            "2026-09-01",
            "2026-10-01",
            "2026-11-01",
            "2026-12-01",
        ]);
        expect(CalendarUtils.getGridShape(date("2026-08-10"), "month")).toEqual({ rowCount: 4, colCount: 3 });
    });

    it("gives a year with a thirteenth month a fifth row", () => {
        const hebrewLeap = DateValueUtils.withCalendar(date("2024-01-15"), "hebrew");

        expect(CalendarUtils.getCells(hebrewLeap, "month", 1)).toHaveLength(13);
        expect(CalendarUtils.getGridShape(hebrewLeap, "month")).toEqual({ rowCount: 5, colCount: 3 });
    });

    it("draws twelve years, three by four, from the page start", () => {
        const cells = CalendarUtils.getCells(date("2026-08-10"), "year", 1);

        expect(cells).toHaveLength(12);
        expect(iso(cells[0])).toBe("2017-01-01");
        expect(iso(cells[11])).toBe("2028-01-01");
        expect(CalendarUtils.getGridShape(date("2026-08-10"), "year")).toEqual({ rowCount: 4, colCount: 3 });
    });
});

describe("getCellAt", () => {
    it("carries off either end of a month page into the neighboring year", () => {
        const first = date("2026-01-01");

        expect(iso(CalendarUtils.getCellAt(first, 12, "month"))).toBe("2027-01-01");
        expect(iso(CalendarUtils.getCellAt(first, -3, "month"))).toBe("2025-10-01");
    });

    it("carries off a year page into the next twelve", () => {
        expect(iso(CalendarUtils.getCellAt(date("2017-01-01"), 14, "year"))).toBe("2031-01-01");
    });

    it("counts days from the grid's first day", () => {
        expect(iso(CalendarUtils.getCellAt(date("2026-07-27"), 42, "day"))).toBe("2026-09-07");
    });
});

describe("cells and bounds", () => {
    it("names a cell by its first day and ends it on its last", () => {
        expect(iso(CalendarUtils.getCellStart(date("2026-08-10"), "month"))).toBe("2026-08-01");
        expect(iso(CalendarUtils.getCellEnd(date("2026-02-10"), "month"))).toBe("2026-02-28");
        expect(iso(CalendarUtils.getCellEnd(date("2026-02-10"), "year"))).toBe("2026-12-31");
        expect(iso(CalendarUtils.getCellEnd(date("2026-02-10"), "day"))).toBe("2026-02-10");
    });

    it("treats two days of one month as the same month cell and not the same day cell", () => {
        expect(CalendarUtils.getIsSameCell(date("2026-08-01"), date("2026-08-31"), "month")).toBe(true);
        expect(CalendarUtils.getIsSameCell(date("2026-08-01"), date("2026-08-31"), "day")).toBe(false);
        expect(CalendarUtils.getIsSameCell(date("2026-08-01"), undefined, "month")).toBe(false);
    });

    it("keeps a month pickable while any of its days is inside the bounds", () => {
        const min = date("2026-03-15");
        const max = date("2026-06-10");

        expect(CalendarUtils.getIsCellInBounds(date("2026-03-01"), "month", min, max)).toBe(true);
        expect(CalendarUtils.getIsCellInBounds(date("2026-06-01"), "month", min, max)).toBe(true);
        expect(CalendarUtils.getIsCellInBounds(date("2026-02-01"), "month", min, max)).toBe(false);
        expect(CalendarUtils.getIsCellInBounds(date("2026-07-01"), "month", min, max)).toBe(false);
        expect(CalendarUtils.getIsCellInBounds(date("2026-03-01"), "day", min, max)).toBe(false);
    });
});

describe("stepPage and stepLeap", () => {
    it("steps a month, a year and twelve years per page", () => {
        expect(iso(CalendarUtils.stepPage(date("2026-08-10"), "day", 1))).toBe("2026-09-10");
        expect(iso(CalendarUtils.stepPage(date("2026-08-10"), "month", -1))).toBe("2025-08-10");
        expect(iso(CalendarUtils.stepPage(date("2026-08-10"), "year", 1))).toBe("2038-08-10");
    });

    it("leaps a year under day precision and twelve pages above it", () => {
        expect(iso(CalendarUtils.stepLeap(date("2026-08-12"), "day", 1))).toBe("2027-08-12");
        expect(iso(CalendarUtils.stepLeap(date("2026-08-12"), "month", 1))).toBe("2038-08-12");
    });
});
