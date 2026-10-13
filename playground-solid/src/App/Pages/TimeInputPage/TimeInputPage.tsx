import { createMemo, createSignal } from "solid-js";

import { CLOSING_TIME, OPENING_TIME } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/TimeInputPage/TimeInputPage.const";
import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { TimeExample } from "./Examples/Time";

const describeTime = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

export const TimeInputPage = () => {
    const timeSignal = createSignal<TimeValue | undefined>({ hour: 9, minute: 30 });
    const twelveHourSignal = createSignal<TimeValue | undefined>({ hour: 14, minute: 30 });
    const preciseSignal = createSignal<TimeValue | undefined>({ hour: 9, minute: 30, second: 0 });
    const shiftSignal = createSignal<TimeValue | undefined>();

    const getExamples = createMemo(() => [
        {
            key: "time",
            name: EXAMPLE_NAMES.time,
            readout: () =>
                `value: ${describeTime(timeSignal[0]())} — the arrows step whichever segment the caret is in`,
            component: () => <TimeExample value={timeSignal} ariaLabel={"Start time"} />,
            path: `${EXAMPLES_ROOT}/Time.tsx`,
        },
        {
            key: "twelve",
            name: EXAMPLE_NAMES.twelve,
            readout: () =>
                `value: ${describeTime(twelveHourSignal[0]())} — the value stays 24-hour, the field reads it as 12`,
            component: () => <TimeExample value={twelveHourSignal} isTwelveHour={true} ariaLabel={"Meeting time"} />,
            path: `${EXAMPLES_ROOT}/Time.tsx`,
        },
        {
            key: "precise",
            name: EXAMPLE_NAMES.precise,
            readout: () => `value: ${describeTime(preciseSignal[0]())} — three segments instead of two`,
            component: () => <TimeExample value={preciseSignal} hasSeconds={true} ariaLabel={"Exact time"} />,
            path: `${EXAMPLES_ROOT}/Time.tsx`,
        },
        {
            key: "shift",
            name: EXAMPLE_NAMES.shift,
            readout: () =>
                `value: ${describeTime(shiftSignal[0]())} — ${TimeUtils.toIso(OPENING_TIME)} to ${TimeUtils.toIso(CLOSING_TIME)}`,
            component: () => (
                <TimeExample
                    value={shiftSignal}
                    minValue={() => OPENING_TIME}
                    maxValue={() => CLOSING_TIME}
                    ariaLabel={"Shift start"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Time.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
