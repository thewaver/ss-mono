import { useState } from "react";

import {
    BOOKING_STEPS,
    CLOSING_TIME,
    OPENING_TIME,
} from "@thewaver/ss-playground-core/App/Pages/DatePickerPage/DatePickerPage.const";
import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { ClockedExample } from "./Examples/Clocked";

const EXAMPLES_ROOT = "/src/App/Pages/TimePickerPage/Examples";

const describeTime = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

export const TimePickerPage = () => {
    const clockedState = useState<TimeValue | undefined>({ hour: 9, minute: 30 });
    const clockedTwelveState = useState<TimeValue | undefined>({ hour: 14, minute: 30 });
    const bookingState = useState<TimeValue | undefined>({ hour: 10, minute: 15 });

    const examples = [
        {
            key: "clocked",
            name: "With a clock",
            readout: () =>
                `value: ${describeTime(clockedState[0])} — one column per unit, so typing and picking cover the same times`,
            component: () => (
                <ClockedExample valueState={clockedState} itemKey={"clocked"} ariaLabel={"Appointment time"} />
            ),
            path: `${EXAMPLES_ROOT}/Clocked.tsx`,
        },
        {
            key: "clockedTwelve",
            name: "Twelve hour, with a clock",
            readout: () =>
                `value: ${describeTime(clockedTwelveState[0])} — the am/pm control and the clock trigger share the trailing slot`,
            component: () => (
                <ClockedExample
                    valueState={clockedTwelveState}
                    itemKey={"clockedTwelve"}
                    isTwelveHour={true}
                    ariaLabel={"Call time"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Clocked.tsx`,
        },
        {
            key: "booking",
            name: "Every fifteen minutes",
            readout: () =>
                `value: ${describeTime(bookingState[0])} — a coarser minute column, still inside ${TimeUtils.toIso(OPENING_TIME)} to ${TimeUtils.toIso(CLOSING_TIME)}`,
            component: () => (
                <ClockedExample
                    valueState={bookingState}
                    itemKey={"booking"}
                    clockSteps={BOOKING_STEPS}
                    minValue={OPENING_TIME}
                    maxValue={CLOSING_TIME}
                    ariaLabel={"Booking time"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Clocked.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
