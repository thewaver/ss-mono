import { createMemo, createSignal } from "solid-js";

import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { BOOKING_STEPS, CLOSING_TIME, OPENING_TIME } from "../DatePickerPage/DatePickerPage.const";
import { ClockedExample } from "./Examples/Clocked";

const EXAMPLES_ROOT = "/src/App/Pages/TimePickerPage/Examples";

const describeTime = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

export const TimePickerPage = () => {
    const clockedSignal = createSignal<TimeValue | undefined>({ hour: 9, minute: 30 });
    const clockedTwelveSignal = createSignal<TimeValue | undefined>({ hour: 14, minute: 30 });
    const bookingSignal = createSignal<TimeValue | undefined>({ hour: 10, minute: 15 });

    const getExamples = createMemo(() => [
        {
            key: "clocked",
            name: "With a clock",
            readout: () =>
                `value: ${describeTime(clockedSignal[0]())} — one column per unit, so typing and picking cover the same times`,
            component: () => (
                <ClockedExample valueSignal={clockedSignal} key={"clocked"} ariaLabel={"Appointment time"} />
            ),
            path: `${EXAMPLES_ROOT}/Clocked.tsx`,
        },
        {
            key: "clockedTwelve",
            name: "Twelve hour, with a clock",
            readout: () =>
                `value: ${describeTime(clockedTwelveSignal[0]())} — the am/pm control and the clock trigger share the trailing slot`,
            component: () => (
                <ClockedExample
                    valueSignal={clockedTwelveSignal}
                    key={"clockedTwelve"}
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
                `value: ${describeTime(bookingSignal[0]())} — a coarser minute column, still inside ${TimeUtils.toIso(OPENING_TIME)} to ${TimeUtils.toIso(CLOSING_TIME)}`,
            component: () => (
                <ClockedExample
                    valueSignal={bookingSignal}
                    key={"booking"}
                    clockSteps={() => BOOKING_STEPS}
                    minTime={() => OPENING_TIME}
                    maxTime={() => CLOSING_TIME}
                    ariaLabel={"Booking time"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Clocked.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
