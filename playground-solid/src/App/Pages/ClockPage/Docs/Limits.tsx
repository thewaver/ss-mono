import { createSignal } from "solid-js";

import { Clock } from "@thewaver/ss-components-solid";
import {
    BOOKING_STEPS,
    CLOSING_TIME,
    LOCALE,
    OPENING_TIME,
} from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import type { TimeValue } from "@thewaver/ss-utils";

import {
    PageClockColumn,
    PageClockFrame,
    PageClockOption,
    PageClockUnit,
} from "../../../StyledComponents/ClockContent/ClockContent";

export const LimitsDocsExample = () => {
    const valueSignal = createSignal<TimeValue | undefined>({ hour: 10, minute: 15 });

    return (
        <PageClockFrame>
            <Clock
                value={valueSignal}
                locale={LOCALE}
                steps={BOOKING_STEPS}
                minValue={OPENING_TIME}
                maxValue={CLOSING_TIME}
                ariaLabel={"Booking time"}
                renderOption={(_unused, getRenderProps) => <PageClockOption renderProps={getRenderProps} />}
                renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
                renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
            />
        </PageClockFrame>
    );
};
