import { createMemo, createSignal } from "solid-js";

import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { CLOSING_TIME, OPENING_TIME } from "../DatePickerPage/DatePickerPage.const";
import { TimeExample } from "./Examples/Time";

const EXAMPLES_ROOT = "/src/App/Pages/TimeInputPage/Examples";

const describeTime = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

export const TimeInputPage = () => {
    const timeSignal = createSignal<TimeValue | undefined>({ hour: 9, minute: 30 });
    const twelveHourSignal = createSignal<TimeValue | undefined>({ hour: 14, minute: 30 });
    const preciseSignal = createSignal<TimeValue | undefined>({ hour: 9, minute: 30, second: 0 });
    const shiftSignal = createSignal<TimeValue | undefined>();

    const getExamples = createMemo(() => [
        {
            key: "time",
            name: "A time, typed or stepped",
            readout: () =>
                `value: ${describeTime(timeSignal[0]())} — the arrows step whichever segment the caret is in`,
            component: () => <TimeExample valueSignal={timeSignal} ariaLabel={"Start time"} />,
            path: `${EXAMPLES_ROOT}/Time.tsx`,
        },
        {
            key: "twelve",
            name: "Twelve hour",
            readout: () =>
                `value: ${describeTime(twelveHourSignal[0]())} — the value stays 24-hour, the field reads it as 12`,
            component: () => (
                <TimeExample valueSignal={twelveHourSignal} isTwelveHour={true} ariaLabel={"Meeting time"} />
            ),
            path: `${EXAMPLES_ROOT}/Time.tsx`,
        },
        {
            key: "precise",
            name: "To the second",
            readout: () => `value: ${describeTime(preciseSignal[0]())} — three segments instead of two`,
            component: () => <TimeExample valueSignal={preciseSignal} hasSeconds={true} ariaLabel={"Exact time"} />,
            path: `${EXAMPLES_ROOT}/Time.tsx`,
        },
        {
            key: "shift",
            name: "Within opening hours",
            readout: () =>
                `value: ${describeTime(shiftSignal[0]())} — ${TimeUtils.toIso(OPENING_TIME)} to ${TimeUtils.toIso(CLOSING_TIME)}`,
            component: () => (
                <TimeExample
                    valueSignal={shiftSignal}
                    minTime={() => OPENING_TIME}
                    maxTime={() => CLOSING_TIME}
                    ariaLabel={"Shift start"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Time.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
