import { useState } from "react";

import { CLOSING_TIME, OPENING_TIME } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/TimeInputPage/TimeInputPage.const";
import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { TimeExample } from "./Examples/Time";

const describeTime = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

export const TimeInputPage = () => {
    const timeState = useState<TimeValue | undefined>({ hour: 9, minute: 30 });
    const twelveHourState = useState<TimeValue | undefined>({ hour: 14, minute: 30 });
    const preciseState = useState<TimeValue | undefined>({ hour: 9, minute: 30, second: 0 });
    const shiftState = useState<TimeValue | undefined>();

    const examples = [
        {
            key: "time",
            name: EXAMPLE_NAMES.time,
            readout: () => `value: ${describeTime(timeState[0])} — the arrows step whichever segment the caret is in`,
            component: () => <TimeExample value={timeState} ariaLabel={"Start time"} />,
            path: `${EXAMPLES_ROOT}/Time.tsx`,
        },
        {
            key: "twelve",
            name: EXAMPLE_NAMES.twelve,
            readout: () =>
                `value: ${describeTime(twelveHourState[0])} — the value stays 24-hour, the field reads it as 12`,
            component: () => <TimeExample value={twelveHourState} isTwelveHour={true} ariaLabel={"Meeting time"} />,
            path: `${EXAMPLES_ROOT}/Time.tsx`,
        },
        {
            key: "precise",
            name: EXAMPLE_NAMES.precise,
            readout: () => `value: ${describeTime(preciseState[0])} — three segments instead of two`,
            component: () => <TimeExample value={preciseState} hasSeconds={true} ariaLabel={"Exact time"} />,
            path: `${EXAMPLES_ROOT}/Time.tsx`,
        },
        {
            key: "shift",
            name: EXAMPLE_NAMES.shift,
            readout: () =>
                `value: ${describeTime(shiftState[0])} — ${TimeUtils.toIso(OPENING_TIME)} to ${TimeUtils.toIso(CLOSING_TIME)}`,
            component: () => (
                <TimeExample
                    value={shiftState}
                    minValue={OPENING_TIME}
                    maxValue={CLOSING_TIME}
                    ariaLabel={"Shift start"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Time.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
