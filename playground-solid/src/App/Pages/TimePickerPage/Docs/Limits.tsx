import { createSignal } from "solid-js";

import { TimePicker } from "@thewaver/ss-components-solid";
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
    const valueSignal = createSignal<TimeValue | undefined>({ hour: 10, minute: 15 });

    const getValueText = () => {
        const value = valueSignal[0]();

        return value ? TimeUtils.toIso(value) : "nothing";
    };

    return (
        <>
            <TimePicker
                value={valueSignal}
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
                renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
                renderPlaceholder={(getFlags, hint) => (
                    <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
                )}
                triggerId={"limitsTrigger"}
                triggerAriaLabel={CLOCK_TRIGGER_LABEL}
                renderTrigger={(getFlags) => <PageTimePickerTrigger flags={getFlags} />}
                renderOption={(_unused, getRenderProps) => <PageClockOption renderProps={getRenderProps} />}
                renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
                renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
                renderPopup={(renderClock) => <PageClockFrame>{renderClock()}</PageClockFrame>}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: ${getValueText()}`}
            </div>
        </>
    );
};
