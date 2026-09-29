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

describe("computeKeyAction", () => {
    const opts = (roving: string, direction: "ltr" | "rtl" = "ltr") => {
        const page = date(roving);

        return {
            roving: page,
            precision: "day" as const,
            cells: CalendarUtils.getCells(page, "day", 1),
            shape: CalendarUtils.getGridShape(page, "day"),
            direction,
        };
    };

    it("picks the roving day on Enter and Space", () => {
        expect(CalendarUtils.computeKeyAction("Enter", false, opts("2026-08-12"))).toMatchObject({ kind: "pick" });
        expect(iso(CalendarUtils.computeKeyAction(" ", false, opts("2026-08-12"))!.day)).toBe("2026-08-12");
    });

    it("carries an arrow off the end of the month into the next", () => {
        const action = CalendarUtils.computeKeyAction("ArrowRight", false, opts("2026-08-31"));

        expect(action?.kind).toBe("move");
        expect(iso(action!.day)).toBe("2026-09-01");
    });

    it("flips the horizontal arrows under right-to-left and leaves the vertical ones", () => {
        expect(iso(CalendarUtils.computeKeyAction("ArrowRight", false, opts("2026-08-12", "rtl"))!.day)).toBe(
            "2026-08-11",
        );
        expect(iso(CalendarUtils.computeKeyAction("ArrowDown", false, opts("2026-08-12", "rtl"))!.day)).toBe(
            "2026-08-19",
        );
    });

    it("keeps Home and End to the week, and the page keys to a month, or a year with Shift", () => {
        expect(iso(CalendarUtils.computeKeyAction("Home", false, opts("2026-08-12"))!.day)).toBe("2026-08-10");
        expect(iso(CalendarUtils.computeKeyAction("End", false, opts("2026-08-12"))!.day)).toBe("2026-08-16");
        expect(iso(CalendarUtils.computeKeyAction("PageDown", false, opts("2026-08-12"))!.day)).toBe("2026-09-12");
        expect(iso(CalendarUtils.computeKeyAction("PageUp", true, opts("2026-08-12"))!.day)).toBe("2025-08-12");
    });

    it("leaves a key that is not the grid's alone", () => {
        expect(CalendarUtils.computeKeyAction("a", false, opts("2026-08-12"))).toBeUndefined();
    });
});

describe("computeMove and computePick", () => {
    it("clamps a move into the bounds and says when it takes the page with it", () => {
        const pageStart = date("2026-08-01");
        const within = CalendarUtils.computeMove(date("2026-08-20"), "day", pageStart);
        const across = CalendarUtils.computeMove(date("2026-09-03"), "day", pageStart);
        const clamped = CalendarUtils.computeMove(date("2026-07-01"), "day", pageStart, date("2026-08-05"));

        expect(within.month).toBeUndefined();
        expect(iso(across.month!)).toBe("2026-09-01");
        expect(iso(clamped.day)).toBe("2026-08-05");
        expect(clamped.month).toBeUndefined();
    });

    it("picks the first day of a coarse cell, pulled inside the bounds", () => {
        expect(iso(CalendarUtils.computePick(date("2026-03-20"), "month"))).toBe("2026-03-01");
        expect(iso(CalendarUtils.computePick(date("2019-06-01"), "year", date("2019-03-15")))).toBe("2019-03-15");
    });
});

describe("computeRovingDay", () => {
    const cells = CalendarUtils.getCells(date("2026-08-10"), "day", 1);
    const today = date("2026-08-10");
    const pageStart = date("2026-08-01");

    it("prefers the highlight, then the anchor, then today, while each is on the page", () => {
        const highlighted = date("2026-08-20");
        const anchor = date("2026-08-15");

        expect(iso(CalendarUtils.computeRovingDay(cells, "day", { highlighted, anchor, today, pageStart }))).toBe(
            "2026-08-20",
        );
        expect(iso(CalendarUtils.computeRovingDay(cells, "day", { anchor, today, pageStart }))).toBe("2026-08-15");
        expect(
            iso(CalendarUtils.computeRovingDay(cells, "day", { anchor: date("2027-01-01"), today, pageStart })),
        ).toBe("2026-08-10");
    });

    it("falls back to the page's first day when nothing else is on it", () => {
        expect(iso(CalendarUtils.computeRovingDay(cells, "day", { today: date("2030-01-01"), pageStart }))).toBe(
            "2026-08-01",
        );
    });
});

describe("getRows and the labels", () => {
    it("cuts the day grid into six weeks", () => {
        const rows = CalendarUtils.getRows(CalendarUtils.getCells(date("2026-08-10"), "day", 1), 7);

        expect(rows).toHaveLength(6);
        expect(rows.every((row) => row.length === 7)).toBe(true);
    });

    it("names a day in full and a page by its month, or by its span of years", () => {
        const page = date("2026-08-01");
        const eraId = CalendarUtils.getCurrentEraId(page, "en-GB");
        const label = CalendarUtils.createCellLabeler(page, "day", eraId, "en-GB");

        expect(label(date("2026-08-10"))).toBe("10 August 2026");
        expect(CalendarUtils.formatPage(page, [], "day", eraId, "en-GB")).toBe("August 2026");

        const years = CalendarUtils.getCells(page, "year", 1);

        expect(CalendarUtils.formatPage(years[0], years, "year", eraId, "en-GB")).toMatch(/2017\D+2028/);
    });
});
