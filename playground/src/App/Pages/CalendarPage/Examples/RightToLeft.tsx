import { Calendar } from "@thewaver/ss-components";

import { PageCalendarCaption } from "../../../StyledComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import { LOCALE, TODAY } from "../CalendarPage.const";
import type { CalendarExampleProps } from "../CalendarPage.types";

type Props = CalendarExampleProps;

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <PageCalendarFrame>
                <PageCalendarCaption monthSignal={props.monthSignal} key={"rightToLeft"} locale={() => LOCALE} />

                <Calendar
                    valueSignal={props.valueSignal}
                    monthSignal={props.monthSignal}
                    today={() => TODAY}
                    locale={() => LOCALE}
                    weekStartsOn={props.weekStartsOn}
                    ariaLabel={"Choose a date in a right-to-left box"}
                    renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
                    renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                />
            </PageCalendarFrame>
        </div>
    );
};
