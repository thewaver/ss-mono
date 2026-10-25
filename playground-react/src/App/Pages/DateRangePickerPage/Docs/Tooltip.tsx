import { useState } from "react";

import type { DateValueRange } from "@thewaver/ss-components-react";
import { DateRangePicker } from "@thewaver/ss-components-react";
import {
    CALENDAR_TRIGGER_LABEL,
    DATE_PART_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { LOCALE, PAIR_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import { PageDatePickerTrigger } from "../../../StyledComponents/DatePickerTrigger/DatePickerTrigger";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import { PageDateRangeSeparator } from "../DateRangePickerPage.content";
import type { DateRangePickerTooltipDocsExampleProps } from "../DateRangePickerPageReact.types";

type Props = DateRangePickerTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueState = useState<DateValueRange | undefined>();

    return (
        <DateRangePicker
            value={valueState}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            startLabel={"Start date"}
            endLabel={"End date"}
            calendarLabel={"Choose a date range"}
            partHints={DATE_PART_HINTS}
            locale={LOCALE}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} width={PAIR_FIELD_WIDTH} />}
            renderPlaceholder={(flags, hint) => (
                <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
            )}
            renderSeparator={() => <PageDateRangeSeparator />}
            tooltipDefs={{
                placement: { x: "center", y: "top_out" },
                offset: { x: 0, y: 10 },
                renderContent: (visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        A tooltip on a date range picker.
                    </PageTooltipContent>
                ),
            }}
            triggerId={"tooltipTrigger"}
            triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
            renderTrigger={(flags) => <PageDatePickerTrigger flags={flags} />}
            renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
            renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            renderPopup={(renderCalendar, monthState) => (
                <PageCalendarFrame>
                    <PageCalendarCaption month={monthState} itemKey={"tooltip"} locale={LOCALE} />

                    {renderCalendar()}
                </PageCalendarFrame>
            )}
        />
    );
};
