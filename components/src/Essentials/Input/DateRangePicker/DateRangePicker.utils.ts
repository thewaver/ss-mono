import type { DateValue, DateValueRange } from "../../../Abstracts/DateValue/DateValue.types";
import { DateValueUtils } from "../../../Abstracts/DateValue/DateValue.utils";
import type { SignalMirrorSplitDefs } from "../../../Abstracts/SignalMirror/SignalMirror.types";

/**
 * How a range picker's one value is carried by its two fields.
 *
 * The consumer holds a single range and the fields hold an end each, so the range is split into its ends and
 * put back together from them — ordered on the way out, so typing the later date into the start field still gives
 * a span rather than a record of which box was typed in.
 */
export namespace DateRangePickerUtils {
    /**
     * What `SignalMirror`'s split takes for a range: the ends are the halves, and a range is the same range
     * whichever way round it was put together.
     */
    export const SPLIT_DEFS: SignalMirrorSplitDefs<DateValueRange, DateValue, DateValue> = {
        compose: (start, end) => DateValueUtils.orderRange(start, end),
        decompose: (range) => [range.start, range.end],
        getIsSame: DateValueUtils.isSameRange,
    };
}
