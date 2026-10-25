import { useState } from "react";

import { TimePicker } from "@thewaver/ss-components-react";
import {
    CLOCK_TRIGGER_LABEL,
    TIME_SEGMENT_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    BOOKING_STEPS,
    CLOSING_TIME,
    FIELD_WIDTH,
    LOCALE,
    OPENING_TIME,
} from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import {
    PageClockColumn,
    PageClockFrame,
    PageClockOption,
    PageClockUnit,
} from "../../../StyledComponents/ClockContent/ClockContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { PageTimePickerTrigger } from "../../../StyledComponents/TimePickerTrigger/TimePickerTrigger";

export const LimitsDocsExample = () => {
    const valueState = useState<TimeValue | undefined>({ hour: 10, minute: 15 });

    const valueText = valueState[0] ? TimeUtils.toIso(valueState[0]) : "nothing";

    return (
        <>
            <TimePicker
                value={valueState}
                clockSteps={BOOKING_STEPS}
                minValue={OPENING_TIME}
                maxValue={CLOSING_TIME}
                ariaLabel={"Booking time"}
                clockLabel={"Choose a time"}
                segmentHints={TIME_SEGMENT_HINTS}
                locale={LOCALE}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
                renderPlaceholder={(flags, hint) => (
                    <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
                )}
                triggerId={"limitsTrigger"}
                triggerAriaLabel={CLOCK_TRIGGER_LABEL}
                renderTrigger={(flags) => <PageTimePickerTrigger flags={flags} />}
                renderOption={(_unused, renderProps) => <PageClockOption renderProps={renderProps} />}
                renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
                renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
                renderPopup={(renderClock) => <PageClockFrame>{renderClock()}</PageClockFrame>}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueText}`}
            </div>
        </>
    );
};
