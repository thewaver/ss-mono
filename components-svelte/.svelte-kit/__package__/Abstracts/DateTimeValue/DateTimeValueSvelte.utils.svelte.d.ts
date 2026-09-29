import { type DateTimeValue, type DateValue } from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";
import type { ValuePair } from "../../Utils/typeUtils.js";
/** The Svelte side of {@link DateTimeValueUtils}: one date-and-time value split into two. */
export declare namespace DateTimeValueSvelteUtils {
    /**
     * Splits one date-and-time value into a date and a time that can each be edited on their own.
     *
     * Two controls both writing to one value have a problem: whichever writes first would clear the other half. So
     * each half is held separately and the pair is written back only once both are filled in, which is what lets a
     * user pick a time before picking a day without the value flapping. Writes in the other direction flow through as
     * well, so setting the whole value updates both controls.
     *
     * Must run while a component is being set up.
     *
     * @param value The whole value, read and written.
     * @returns A pair per half. Either can be set to `undefined`, which leaves the whole value `undefined` until both
     * halves are filled in again.
     */
    const createSplit: (value: ValuePair<DateTimeValue | undefined>) => {
        date: ValuePair<DateValue | undefined>;
        time: ValuePair<TimeValue | undefined>;
    };
}
