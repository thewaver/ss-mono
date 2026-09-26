import { Show } from "solid-js";

import type { ClockSteps, MaybeAccessor } from "@thewaver/ss-components";
import { TimePicker, access } from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import { CLOCK_TRIGGER_LABEL, TIME_SEGMENT_HINTS } from "../../../PageComponents/Announcements/Announcements.const";
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
import { FIELD_WIDTH, LOCALE } from "../../DatePickerPage/DatePickerPage.const";
import type { TimeExampleProps } from "../../DatePickerPage/DatePickerPage.types";

import { FIELD_GAP, FIELD_STEPPER_PADDING } from "../../../StyledComponents/TextFieldContent/TextFieldContent.css";

type Props = TimeExampleProps & {
    key: MaybeAccessor<string>;
    ariaLabel: MaybeAccessor<string>;
    isTwelveHour?: MaybeAccessor<boolean>;
    hasSeconds?: MaybeAccessor<boolean>;
    clockSteps?: MaybeAccessor<ClockSteps>;
    minValue?: MaybeAccessor<TimeValue>;
    maxValue?: MaybeAccessor<TimeValue>;
};

export const ClockedExample = (props: Props) => {
    return (
        <TimePicker
            valueSignal={props.valueSignal}
            isTwelveHour={props.isTwelveHour}
            hasSeconds={props.hasSeconds}
            clockSteps={props.clockSteps}
            minValue={props.minValue}
            maxValue={props.maxValue}
            ariaLabel={props.ariaLabel}
            clockLabel={"Choose a time"}
            segmentHints={TIME_SEGMENT_HINTS}
            locale={() => LOCALE}
            padding={() => FIELD_STEPPER_PADDING}
            gap={() => FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} />}
            renderPlaceholder={(getFlags, hint) => (
                <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
            )}
            renderTrailing={(getFlags, meridiem) => (
                <Show when={access(props.isTwelveHour)}>
                    <PageMeridiemToggle
                        meridiem={meridiem.getValue}
                        isDisabled={() => getFlags().isDisabled ?? false}
                        onToggle={meridiem.toggle}
                    />
                </Show>
            )}
            triggerId={() => `${access(props.key)}Trigger`}
            triggerAriaLabel={CLOCK_TRIGGER_LABEL}
            renderTrigger={(getFlags) => <PageTimePickerTrigger flags={getFlags} />}
            renderOption={(_unused, getRenderProps) => <PageClockOption renderProps={getRenderProps} />}
            renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
            renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
            renderPopup={(renderClock) => <PageClockFrame>{renderClock()}</PageClockFrame>}
        />
    );
};
