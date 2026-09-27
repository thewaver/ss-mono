import { useState } from "react";

import { CalendarDate } from "@internationalized/date";
import type { DateTimeValue } from "@thewaver/ss-components";

import { DateTimeValueReactUtils } from "../../src";

export const Default = () => {
    const valueState = useState<DateTimeValue | undefined>(undefined);
    const { dateState, timeState } = DateTimeValueReactUtils.useSplit(valueState);
    const [value, setValue] = valueState;

    return (
        <>
            <button type="button" data-testid="time" onClick={() => timeState[1]({ hour: 9, minute: 30 })}>
                Time
            </button>
            <button type="button" data-testid="date" onClick={() => dateState[1](new CalendarDate(2026, 3, 1))}>
                Date
            </button>
            <button type="button" data-testid="clear" onClick={() => setValue(undefined)}>
                Clear
            </button>
            <output data-readout="whole">
                {value ? `${value.date.toString()} ${value.time.hour}:${value.time.minute}` : "none"}
            </output>
            <output data-readout="halves">{`${dateState[0]?.toString() ?? "-"} ${timeState[0] ? "time" : "-"}`}</output>
        </>
    );
};
