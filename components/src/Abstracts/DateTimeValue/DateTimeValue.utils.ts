import type { Signal } from "solid-js";
import { createEffect, createSignal, untrack } from "solid-js";

import { TimeUtils, type TimeValue } from "@thewaver/ss-utils";

import type { DateValue } from "../DateValue/DateValue.types";
import { DateValueUtils } from "../DateValue/DateValue.utils";
import type { DateTimeValue } from "./DateTimeValue.types";

/** Milliseconds in a second. */
const MS_PER_SECOND = 1000;

/**
 * Pairs a calendar date with a time of day, and lets the two be edited separately.
 *
 * A date-and-time value is kept as its two halves rather than as one instant, because that is how
 * it is edited: a calendar picks the day and a clock picks the time, and neither should disturb the
 * other. {@link DateTimeValueUtils.createSplit} is what connects those two controls to one value.
 */
export namespace DateTimeValueUtils {
    /** Pairs a date with a time. */
    export const of = (date: DateValue, time: TimeValue): DateTimeValue => ({ date, time });

    /** Replaces the date, keeping the time. */
    export const withDate = (value: DateTimeValue, date: DateValue): DateTimeValue => ({ ...value, date });

    /** Replaces the time, keeping the date. */
    export const withTime = (value: DateTimeValue, time: TimeValue): DateTimeValue => ({ ...value, time });

    /** Tests whether two values name the same day and the same time. Two missing values count as the same. */
    export const isSame = (a: DateTimeValue | undefined, b: DateTimeValue | undefined) =>
        a === b ||
        (a !== undefined &&
            b !== undefined &&
            DateValueUtils.isSame(a.date, b.date) &&
            TimeUtils.isSame(a.time, b.time));

    /**
     * Orders two values by day, then by time.
     *
     * @returns A negative number when `a` is earlier, `0` when they match, a positive number when `a`
     * is later.
     */
    export const compare = (a: DateTimeValue, b: DateTimeValue) => {
        const byDate = DateValueUtils.compare(a.date, b.date);

        return byDate !== 0 ? byDate : TimeUtils.compare(a.time, b.time);
    };

    /**
     * Splits a `Date` into the day and time it falls on locally.
     *
     * @param date The instant to read.
     * @param hasSeconds Whether to carry the seconds. Left out by default, since a control that does
     * not show seconds should not be holding a value with them.
     */
    export const fromDate = (date: Date, hasSeconds = false): DateTimeValue => ({
        date: DateValueUtils.fromDate(date),
        time: hasSeconds
            ? { hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() }
            : { hour: date.getHours(), minute: date.getMinutes() },
    });

    /**
     * Splits one date-and-time signal into a date signal and a time signal.
     *
     * Two controls both writing to one value have a problem: whichever writes first would clear the
     * other half. So each half is held separately and the pair is written back only once both are
     * filled in, which is what lets a user pick a time before picking a day without the value flapping.
     * Writes in the other direction flow through as well, so setting the whole value updates both
     * controls.
     *
     * @param signal The whole value's signal.
     * @returns A signal per half, each usable as an ordinary Solid signal. Either can be set to
     * `undefined`, which leaves the whole value `undefined` until both halves are filled in again.
     */
    export const createSplit = (
        signal: Signal<DateTimeValue | undefined>,
    ): { dateSignal: Signal<DateValue | undefined>; timeSignal: Signal<TimeValue | undefined> } => {
        const [getDate, setDate] = createSignal<DateValue | undefined>(untrack(() => signal[0]()?.date));
        const [getTime, setTime] = createSignal<TimeValue | undefined>(untrack(() => signal[0]()?.time));

        createEffect(() => {
            const value = signal[0]();

            if (!value) return;

            setDate(() => value.date);
            setTime(() => value.time);
        });

        const emit = () => {
            const date = untrack(getDate);
            const time = untrack(getTime);
            const next = date !== undefined && time !== undefined ? of(date, time) : undefined;

            if (isSame(next, untrack(signal[0]))) return;

            signal[1](() => next);
        };

        const dateSignal = [
            getDate,
            (next: unknown) => {
                setDate(typeof next === "function" ? (next as never) : () => next as DateValue | undefined);
                emit();

                return untrack(getDate);
            },
        ] as Signal<DateValue | undefined>;

        const timeSignal = [
            getTime,
            (next: unknown) => {
                setTime(typeof next === "function" ? (next as never) : () => next as TimeValue | undefined);
                emit();

                return untrack(getTime);
            },
        ] as Signal<TimeValue | undefined>;

        return { dateSignal, timeSignal };
    };

    /**
     * Joins the two halves back into one instant, in the local time zone.
     *
     * @returns The `Date` the value names.
     */
    export const toDate = (value: DateTimeValue) =>
        new Date(DateValueUtils.toDate(value.date).getTime() + TimeUtils.getSecondOfDay(value.time) * MS_PER_SECOND);
}
