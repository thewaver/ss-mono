import { createSignal } from "solid-js";

import { TimePicker } from "@thewaver/ss-components-solid";
import {
    CLOCK_TRIGGER_LABEL,
    TIME_SEGMENT_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
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
import type { TimePickerBasicDocsExampleProps } from "../TimePickerPageSolid.types";

type Props = TimePickerBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueSignal = createSignal<TimeValue | undefined>({ hour: 9, minute: 30 });

    return (
        <TimePicker
            value={valueSignal}
            isReadOnly={props.isReadOnly}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"Appointment time"}
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
            triggerId={"basicTrigger"}
            triggerAriaLabel={CLOCK_TRIGGER_LABEL}
            renderTrigger={(getFlags) => <PageTimePickerTrigger flags={getFlags} />}
            renderOption={(_unused, getRenderProps) => <PageClockOption renderProps={getRenderProps} />}
            renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
            renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
            renderPopup={(renderClock) => <PageClockFrame>{renderClock()}</PageClockFrame>}
        />
    );
};
