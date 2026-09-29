import { createRoot, createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import { CalendarDate } from "@internationalized/date";
import { type DateTimeValue, DateTimeValueUtils } from "@thewaver/ss-components";

import { DateTimeValueSolidUtils } from "./DateTimeValueSolid.utils";

const day = (year: number, month: number, date: number) => new CalendarDate(year, month, date);

describe("createSplit", () => {
    it("reads each half out of the one value", () => {
        createRoot((dispose) => {
            const signal = createSignal<DateTimeValue | undefined>(
                DateTimeValueUtils.of(day(2026, 3, 1), { hour: 9, minute: 30 }),
            );
            const { date: dateSignal, time: timeSignal } = DateTimeValueSolidUtils.createSplit(signal);

            expect(dateSignal[0]()?.day).toBe(1);
            expect(timeSignal[0]()?.hour).toBe(9);

            dispose();
        });
    });

    it("writes one half back without disturbing the other", () => {
        createRoot((dispose) => {
            const signal = createSignal<DateTimeValue | undefined>(
                DateTimeValueUtils.of(day(2026, 3, 1), { hour: 9, minute: 30 }),
            );
            const { date: dateSignal, time: timeSignal } = DateTimeValueSolidUtils.createSplit(signal);

            timeSignal[1](() => ({ hour: 17, minute: 45 }));

            expect(signal[0]()?.time.hour).toBe(17);
            expect(signal[0]()?.date.day).toBe(1);

            dateSignal[1](() => day(2026, 3, 4));

            expect(signal[0]()?.date.day).toBe(4);
            expect(signal[0]()?.time.hour).toBe(17);

            dispose();
        });
    });

    it("reports nothing while only one half is set, the same way half a range is not a range", () => {
        createRoot((dispose) => {
            const signal = createSignal<DateTimeValue | undefined>(undefined);
            const { date: dateSignal, time: timeSignal } = DateTimeValueSolidUtils.createSplit(signal);

            dateSignal[1](() => day(2026, 5, 9));

            expect(signal[0]()).toBeUndefined();

            timeSignal[1](() => ({ hour: 8, minute: 15 }));

            expect(signal[0]()?.date.month).toBe(5);
            expect(signal[0]()?.time.hour).toBe(8);

            dispose();
        });
    });

    it("remembers the other half while one is cleared, so retyping does not lose it", () => {
        createRoot((dispose) => {
            const signal = createSignal<DateTimeValue | undefined>(
                DateTimeValueUtils.of(day(2026, 3, 1), { hour: 9, minute: 30 }),
            );
            const { date: dateSignal } = DateTimeValueSolidUtils.createSplit(signal);

            dateSignal[1](() => undefined);

            expect(signal[0](), "the pair is gone while a half is missing").toBeUndefined();

            dateSignal[1](() => day(2026, 3, 4));

            expect(signal[0]()?.time.hour, "and the time comes back with the new date").toBe(9);
            expect(signal[0]()?.date.day).toBe(4);

            dispose();
        });
    });

    it("clearing either half clears the whole value, because the pair is one value", () => {
        createRoot((dispose) => {
            const signal = createSignal<DateTimeValue | undefined>(
                DateTimeValueUtils.of(day(2026, 3, 1), { hour: 9, minute: 30 }),
            );
            const { date: dateSignal } = DateTimeValueSolidUtils.createSplit(signal);

            dateSignal[1](() => undefined);

            expect(signal[0]()).toBeUndefined();

            dispose();
        });
    });
});
