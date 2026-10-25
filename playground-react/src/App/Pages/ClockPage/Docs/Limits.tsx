import { useState } from "react";

import { Clock } from "@thewaver/ss-components-react";
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
    const valueState = useState<TimeValue | undefined>({ hour: 10, minute: 15 });

    return (
        <PageClockFrame>
            <Clock
                value={valueState}
                locale={LOCALE}
                steps={BOOKING_STEPS}
                minValue={OPENING_TIME}
                maxValue={CLOSING_TIME}
                ariaLabel={"Booking time"}
                renderOption={(_unused, renderProps) => <PageClockOption renderProps={renderProps} />}
                renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
                renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
            />
        </PageClockFrame>
    );
};
