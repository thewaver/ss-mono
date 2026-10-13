import { useState } from "react";

import type { DateTimeValue } from "@thewaver/ss-components-react";
import { DateTimeValueUtils, DateValueUtils } from "@thewaver/ss-components-react";
import { TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    NOON,
} from "@thewaver/ss-playground/App/Pages/DateTimePickerPage/DateTimePickerPage.const";
import { TimeUtils } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PairedExample } from "./Examples/Paired";
import { PickedExample } from "./Examples/Picked";

const describe = (value: DateTimeValue | undefined) =>
    value
        ? `${DateValueUtils.toIso(value.date)} at ${String(value.time.hour).padStart(2, "0")}:${String(value.time.minute).padStart(2, "0")}`
        : "none";

export const DateTimePickerPage = () => {
    const emptyValue = useState<DateTimeValue | undefined>();
    const seededValue = useState<DateTimeValue | undefined>(() => DateTimeValueUtils.of(TODAY, NOON));
    const pickedValue = useState<DateTimeValue | undefined>();
    const twelveHourValue = useState<DateTimeValue | undefined>();

    const examples = [
        {
            key: "paired",
            name: EXAMPLE_NAMES.paired,
            readout: () => `value: ${describe(emptyValue[0])}`,
            component: () => <PairedExample value={emptyValue} />,
            path: `${EXAMPLES_ROOT}/Paired.tsx`,
        },
        {
            key: "picked",
            name: EXAMPLE_NAMES.picked,
            readout: () => `value: ${describe(pickedValue[0])}`,
            component: () => <PickedExample value={pickedValue} itemKey={"picked"} />,
            path: `${EXAMPLES_ROOT}/Picked.tsx`,
        },
        {
            key: "twelveHour",
            name: EXAMPLE_NAMES.twelveHour,
            readout: () => `value: ${describe(twelveHourValue[0])}`,
            component: () => (
                <PickedExample value={twelveHourValue} itemKey={"twelveHour"} isTwelveHour={true} hasSeconds={true} />
            ),
            path: `${EXAMPLES_ROOT}/Picked.tsx`,
        },
        {
            key: "seeded",
            name: EXAMPLE_NAMES.seeded,
            readout: () =>
                `value: ${describe(seededValue[0])} — seconds of day: ${
                    seededValue[0] ? TimeUtils.getSecondOfDay(seededValue[0].time) : 0
                }`,
            component: () => <PairedExample value={seededValue} />,
            path: `${EXAMPLES_ROOT}/Paired.tsx`,
        },
    ];

    return <PageExamples items={examples} minColumnWidth={520} />;
};
