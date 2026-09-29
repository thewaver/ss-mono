import { createSignal } from "solid-js";

import { type DateValue, RangeCalendarUtils } from "@thewaver/ss-components";

import { accessSignal } from "../../../Utils/propUtils";
import { CalendarComposite } from "../Calendar/Calendar";
import type { RangeCalendarProps } from "../Calendar/CalendarSolid.types";

export const RangeCalendar = (props: RangeCalendarProps) => {
    const valueSignal = accessSignal(() => props.value);

    const [getPendingStart, setPendingStart] = createSignal<DateValue | undefined>();
    const [getLastPicked, setLastPicked] = createSignal<DateValue | undefined>();

    const getRange = () => valueSignal[0]();

    const pick = (day: DateValue) => {
        const next = RangeCalendarUtils.computePick(day, getPendingStart());

        setLastPicked(() => day);
        setPendingStart(() => next.pendingStart);
        valueSignal[1](() => next.range);
    };

    return (
        <CalendarComposite
            {...props}
            computeIsSelected={(day) => RangeCalendarUtils.getIsSelected(day, getPendingStart(), getRange())}
            computeAnchorDay={() =>
                getPendingStart() ?? RangeCalendarUtils.computeAnchorDay(undefined, getLastPicked(), getRange())
            }
            computeRange={(highlighted) =>
                RangeCalendarUtils.computePaintedRange(highlighted, getPendingStart(), getRange())
            }
            onPick={pick}
        />
    );
};
