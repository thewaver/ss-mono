import { DateTimeValueUtils } from "@thewaver/ss-components";
import { SignalMirrorSvelteUtils } from "../SignalMirror/SignalMirrorSvelte.utils.svelte.js";
/** The Svelte side of {@link DateTimeValueUtils}: one date-and-time value split into two. */
export var DateTimeValueSvelteUtils;
(function (DateTimeValueSvelteUtils) {
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
    DateTimeValueSvelteUtils.createSplit = (value) => {
        const { first, second } = SignalMirrorSvelteUtils.createSplit(value, {
            compose: (date, time) => DateTimeValueUtils.of(date, time),
            decompose: (whole) => [whole.date, whole.time],
            getIsSame: DateTimeValueUtils.isSame,
        });
        return { date: first, time: second };
    };
})(DateTimeValueSvelteUtils || (DateTimeValueSvelteUtils = {}));
