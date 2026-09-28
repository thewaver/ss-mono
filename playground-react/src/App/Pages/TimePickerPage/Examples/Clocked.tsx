import type { ClockSteps } from "@thewaver/ss-components-react";
import { TimePicker } from "@thewaver/ss-components-react";
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

import { PageMeridiemToggle } from "../../../PageComponents/MeridiemToggle/MeridiemToggle";
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
import type { TimeExampleProps } from "../../DatePickerPage/DatePickerPage.types";

type Props = TimeExampleProps & {
    itemKey: string;
    ariaLabel: string;
    isTwelveHour?: boolean;
    hasSeconds?: boolean;
    clockSteps?: ClockSteps;
    minValue?: TimeValue;
    maxValue?: TimeValue;
};

export const ClockedExample = (props: Props) => {
    return (
        <TimePicker
            valueState={props.valueState}
            isTwelveHour={props.isTwelveHour}
            hasSeconds={props.hasSeconds}
            clockSteps={props.clockSteps}
            minValue={props.minValue}
            maxValue={props.maxValue}
            ariaLabel={props.ariaLabel}
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
            renderTrailing={(flags, meridiem) =>
                props.isTwelveHour && (
                    <PageMeridiemToggle
                        meridiem={meridiem.value}
                        isDisabled={flags.isDisabled ?? false}
                        onToggle={meridiem.toggle}
                    />
                )
            }
            triggerId={`${props.itemKey}Trigger`}
            triggerAriaLabel={CLOCK_TRIGGER_LABEL}
            renderTrigger={(flags) => <PageTimePickerTrigger flags={flags} />}
            renderOption={(_unused, renderProps) => <PageClockOption renderProps={renderProps} />}
            renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
            renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
            renderPopup={(renderClock) => <PageClockFrame>{renderClock()}</PageClockFrame>}
        />
    );
};
