import { createMemo, createSignal } from "solid-js";

import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { BOOKING_STEPS, CLOSING_TIME, OPENING_TIME } from "../DatePickerPage/DatePickerPage.const";
import { DefaultExample } from "./Examples/Default";

const EXAMPLES_ROOT = "/src/App/Pages/ClockPage/Examples";

const describeTime = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

export const ClockPage = () => {
    const defaultSignal = createSignal<TimeValue | undefined>({ hour: 9, minute: 30 });
    const twelveHourSignal = createSignal<TimeValue | undefined>({ hour: 14, minute: 30 });
    const boundedSignal = createSignal<TimeValue | undefined>({ hour: 10, minute: 15 });

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: "One column per unit",
            readout: () =>
                `value: ${describeTime(defaultSignal[0]())} — picking an hour and picking a minute are two independent choices, so no column has to list every time of day`,
            component: () => <DefaultExample valueSignal={defaultSignal} ariaLabel={"Appointment time"} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "twelve",
            name: "Twelve hour",
            readout: () =>
                `value: ${describeTime(twelveHourSignal[0]())} — am and pm become a column of their own, and the value stays 24-hour`,
            component: () => (
                <DefaultExample valueSignal={twelveHourSignal} isTwelveHour={true} ariaLabel={"Call time"} />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "bounded",
            name: "Coarser, and bounded",
            readout: () =>
                `value: ${describeTime(boundedSignal[0]())} — quarter hours only, inside ${TimeUtils.toIso(OPENING_TIME)} to ${TimeUtils.toIso(CLOSING_TIME)}`,
            component: () => (
                <DefaultExample
                    valueSignal={boundedSignal}
                    steps={() => BOOKING_STEPS}
                    min={() => OPENING_TIME}
                    max={() => CLOSING_TIME}
                    ariaLabel={"Booking time"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
