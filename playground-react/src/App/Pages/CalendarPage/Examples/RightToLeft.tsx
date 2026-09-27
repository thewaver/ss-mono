import { Calendar } from "@thewaver/ss-components-react";
import { LOCALE, TODAY } from "@thewaver/ss-playground-core/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { CalendarExampleProps } from "../CalendarPage.types";

type Props = CalendarExampleProps;

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <PageCalendarFrame>
                <PageCalendarCaption monthState={props.monthState} itemKey={"rightToLeft"} locale={LOCALE} />

                <Calendar
                    valueState={props.valueState}
                    monthState={props.monthState}
                    today={TODAY}
                    locale={LOCALE}
                    weekStartsOn={props.weekStartsOn}
                    ariaLabel={"Choose a date in a right-to-left box"}
                    renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                    renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                />
            </PageCalendarFrame>
        </div>
    );
};
