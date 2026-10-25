import { createSignal } from "solid-js";

import type { DateValue } from "@thewaver/ss-components-solid";
import { DatePicker } from "@thewaver/ss-components-solid";
import {
    CALENDAR_TRIGGER_LABEL,
    DATE_PART_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH, LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
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
import type { DatePickerTooltipDocsExampleProps } from "../DatePickerPageSolid.types";

type Props = DatePickerTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueSignal = createSignal<DateValue | undefined>(TODAY);

    return (
        <DatePicker
            value={valueSignal}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            ariaLabel={"Date with a tooltip"}
            calendarLabel={"Choose a date"}
            partHints={DATE_PART_HINTS}
            locale={LOCALE}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
            renderPlaceholder={(getFlags, hint) => (
                <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
            )}
            tooltipDefs={() => ({
                placement: () => ({ x: "center", y: "top_out" }),
                offset: () => ({ x: 0, y: 10 }),
                renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        A tooltip on a date picker.
                    </PageTooltipContent>
                ),
            })}
            triggerId={"tooltipTrigger"}
            triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
            renderTrigger={(getFlags) => <PageDatePickerTrigger flags={getFlags} />}
            renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
            renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            renderPopup={(renderCalendar, monthSignal) => (
                <PageCalendarFrame>
                    <PageCalendarCaption month={monthSignal} key={"tooltip"} locale={LOCALE} />

                    {renderCalendar()}
                </PageCalendarFrame>
            )}
        />
    );
};
