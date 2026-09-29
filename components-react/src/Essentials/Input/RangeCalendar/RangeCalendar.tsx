import { useState } from "react";

import { type DateValue, RangeCalendarUtils } from "@thewaver/ss-components";

import { CalendarComposite } from "../Calendar/Calendar";
import type { RangeCalendarProps } from "../Calendar/Calendar.types";

export const RangeCalendar = (props: RangeCalendarProps) => {
    const [range, setRange] = props.value;

    const [pendingStart, setPendingStart] = useState<DateValue>();
    const [lastPicked, setLastPicked] = useState<DateValue>();

    const pick = (day: DateValue) => {
        const next = RangeCalendarUtils.computePick(day, pendingStart);

        setLastPicked(day);
        setPendingStart(next.pendingStart);
        setRange(next.range);
    };

    return (
        <CalendarComposite
            {...props}
            computeIsSelected={(day) => RangeCalendarUtils.getIsSelected(day, pendingStart, range)}
            anchorDay={RangeCalendarUtils.computeAnchorDay(pendingStart, lastPicked, range)}
            computeRange={(highlighted) => RangeCalendarUtils.computePaintedRange(highlighted, pendingStart, range)}
            onPick={pick}
        />
    );
};
