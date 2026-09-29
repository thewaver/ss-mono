import type { Ref } from "vue";

import { type DateTimeValue, DateTimeValueUtils, type DateValue } from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import { SignalMirrorVueUtils } from "../SignalMirror/SignalMirrorVue.utils";

/** The Vue side of `DateTimeValueUtils`: one date-and-time value split into two writable refs. */
export namespace DateTimeValueVueUtils {
    /**
     * Splits one date-and-time value into a date and a time that can each be edited on their own.
     *
     * `SignalMirrorVueUtils.useSplit` with the pair the value is made of. The whole value is written only once both
     * halves are filled in, which is what lets a user pick a time before picking a day without the value flapping.
     *
     * Must run inside a component's `setup` or another effect scope.
     *
     * @param value The whole value, read and written.
     * @returns `date` and `time`, each a writable ref. Either can be set to `undefined`, which leaves the whole value
     * `undefined` until both halves are filled in again.
     */
    export const useSplit = (value: Ref<DateTimeValue | undefined>) => {
        const { first, second } = SignalMirrorVueUtils.useSplit<DateTimeValue, DateValue, TimeValue>(value, {
            compose: (date, time) => DateTimeValueUtils.of(date, time),
            decompose: (whole) => [whole.date, whole.time],
            getIsSame: DateTimeValueUtils.isSame,
        });

        return { date: first, time: second };
    };
}
