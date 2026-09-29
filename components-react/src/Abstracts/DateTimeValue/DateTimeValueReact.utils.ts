import { type DateTimeValue, DateTimeValueUtils, type DateValue } from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import { SignalMirrorReactUtils } from "../SignalMirror/SignalMirrorReact.utils";

/** The React side of `DateTimeValueUtils`: one date-and-time value split into two pieces of state. */
export namespace DateTimeValueReactUtils {
    /**
     * Splits one date-and-time value into a date and a time that can each be edited on their own.
     *
     * `SignalMirrorReactUtils.useSplit` with the pair the value is made of. The whole value is written only once
     * both halves are filled in, which is what lets a user pick a time before picking a day without the value
     * flapping.
     *
     * @param valueState The whole value, and how to change it.
     * @returns `date` and `time`, each a `[value, setValue]`. Either can be set to `undefined`, which leaves
     * the whole value `undefined` until both halves are filled in again.
     */
    export const useSplit = (
        valueState: readonly [DateTimeValue | undefined, (value: DateTimeValue | undefined) => void],
    ) => {
        const { first: firstState, second: secondState } = SignalMirrorReactUtils.useSplit<DateTimeValue, DateValue, TimeValue>(
            valueState,
            {
                compose: (date, time) => DateTimeValueUtils.of(date, time),
                decompose: (value) => [value.date, value.time],
                getIsSame: DateTimeValueUtils.isSame,
            },
        );

        return { date: firstState, time: secondState };
    };
}
