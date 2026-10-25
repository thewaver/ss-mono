import { useState } from "react";

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
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { TimePickerTooltipDocsExampleProps } from "../TimePickerPageReact.types";

type Props = TimePickerTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueState = useState<TimeValue | undefined>({ hour: 9, minute: 30 });

    return (
        <TimePicker
            value={valueState}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            ariaLabel={"Time with a tooltip"}
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
            tooltipDefs={{
                placement: { x: "center", y: "top_out" },
                offset: { x: 0, y: 10 },
                renderContent: (visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        A tooltip on a time picker.
                    </PageTooltipContent>
                ),
            }}
            triggerId={"tooltipTrigger"}
            triggerAriaLabel={CLOCK_TRIGGER_LABEL}
            renderTrigger={(flags) => <PageTimePickerTrigger flags={flags} />}
            renderOption={(_unused, renderProps) => <PageClockOption renderProps={renderProps} />}
            renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
            renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
            renderPopup={(renderClock) => <PageClockFrame>{renderClock()}</PageClockFrame>}
        />
    );
};
