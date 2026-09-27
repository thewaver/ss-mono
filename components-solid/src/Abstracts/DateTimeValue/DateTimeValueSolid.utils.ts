import type { Signal } from "solid-js";

import { type DateTimeValue, DateTimeValueUtils, type DateValue } from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import { SignalMirrorSolidUtils } from "../SignalMirror/SignalMirrorSolid.utils";

/** The Solid side of {@link DateTimeValueUtils}: one date-and-time signal split into two. */
export namespace DateTimeValueSolidUtils {
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
        const { firstSignal, secondSignal } = SignalMirrorSolidUtils.createSplit<DateTimeValue, DateValue, TimeValue>(
            signal,
            {
                compose: (date, time) => DateTimeValueUtils.of(date, time),
                decompose: (value) => [value.date, value.time],
                getIsSame: DateTimeValueUtils.isSame,
            },
        );

        return { dateSignal: firstSignal, timeSignal: secondSignal };
    };
}
