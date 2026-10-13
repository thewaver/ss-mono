import { useState } from "react";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/ClockPage/ClockPage.const";
import {
    BOOKING_STEPS,
    CLOSING_TIME,
    OPENING_TIME,
} from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DefaultExample } from "./Examples/Default";

const describeTime = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

export const ClockPage = () => {
    const defaultState = useState<TimeValue | undefined>({ hour: 9, minute: 30 });
    const twelveHourState = useState<TimeValue | undefined>({ hour: 14, minute: 30 });
    const boundedState = useState<TimeValue | undefined>({ hour: 10, minute: 15 });

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () =>
                `value: ${describeTime(defaultState[0])} — picking an hour and picking a minute are two independent choices, so no column has to list every time of day`,
            component: () => <DefaultExample value={defaultState} ariaLabel={"Appointment time"} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "twelve",
            name: EXAMPLE_NAMES.twelve,
            readout: () =>
                `value: ${describeTime(twelveHourState[0])} — am and pm become a column of their own, and the value stays 24-hour`,
            component: () => <DefaultExample value={twelveHourState} isTwelveHour={true} ariaLabel={"Call time"} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "bounded",
            name: EXAMPLE_NAMES.bounded,
            readout: () =>
                `value: ${describeTime(boundedState[0])} — quarter hours only, inside ${TimeUtils.toIso(OPENING_TIME)} to ${TimeUtils.toIso(CLOSING_TIME)}`,
            component: () => (
                <DefaultExample
                    value={boundedState}
                    steps={BOOKING_STEPS}
                    minValue={OPENING_TIME}
                    maxValue={CLOSING_TIME}
                    ariaLabel={"Booking time"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
