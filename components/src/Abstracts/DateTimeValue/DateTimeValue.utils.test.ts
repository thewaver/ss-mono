import { describe, expect, it } from "vitest";

import { CalendarDate } from "@internationalized/date";

import { DateTimeValueUtils } from "./DateTimeValue.utils";

const day = (year: number, month: number, date: number) => new CalendarDate(year, month, date);

describe("isSame", () => {
    it("matches on both halves and ignores the seconds shape", () => {
        const a = DateTimeValueUtils.of(day(2026, 3, 1), { hour: 9, minute: 30 });
        const b = DateTimeValueUtils.of(day(2026, 3, 1), { hour: 9, minute: 30, second: 0 });

        expect(DateTimeValueUtils.isSame(a, b)).toBe(true);
    });

    it("separates two values that share a date but not a time", () => {
        const a = DateTimeValueUtils.of(day(2026, 3, 1), { hour: 9, minute: 30 });
        const b = DateTimeValueUtils.of(day(2026, 3, 1), { hour: 9, minute: 31 });

        expect(DateTimeValueUtils.isSame(a, b)).toBe(false);
    });
});

describe("compare", () => {
    it("orders by date first and falls back to time on the same day", () => {
        const earlyOnLaterDay = DateTimeValueUtils.of(day(2026, 3, 2), { hour: 1, minute: 0 });
        const lateOnEarlierDay = DateTimeValueUtils.of(day(2026, 3, 1), { hour: 23, minute: 0 });
        const sameDayEarlier = DateTimeValueUtils.of(day(2026, 3, 1), { hour: 8, minute: 0 });

        expect(DateTimeValueUtils.compare(lateOnEarlierDay, earlyOnLaterDay)).toBeLessThan(0);
        expect(DateTimeValueUtils.compare(sameDayEarlier, lateOnEarlierDay)).toBeLessThan(0);
        expect(DateTimeValueUtils.compare(lateOnEarlierDay, lateOnEarlierDay)).toBe(0);
    });
});
