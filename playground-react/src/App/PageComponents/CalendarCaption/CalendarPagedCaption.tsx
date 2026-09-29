import { Button, CalendarUtils, DateValueUtils } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageCalendarHeader, PageCalendarTitle } from "../../StyledComponents/CalendarContent/CalendarContent";
import type { PageCalendarPagedCaptionProps } from "./CalendarPagedCaption.types";

const PAGE_STEP = 1;
const WEEK_STARTS_ON = 1;
const YEAR_OPTIONS: Intl.DateTimeFormatOptions = { year: "numeric" };
const MONTH_TITLE_OPTIONS: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };

export const PageCalendarPagedCaption = (props: PageCalendarPagedCaptionProps) => {
    const [month, setMonth] = props.month;

    const getTitle = () => {
        if (props.precision === "day") return DateValueUtils.format(month, MONTH_TITLE_OPTIONS, props.locale);
        if (props.precision === "month") return DateValueUtils.format(month, YEAR_OPTIONS, props.locale);

        const cells = CalendarUtils.getCells(month, props.precision, WEEK_STARTS_ON);

        return CalendarUtils.formatSpan(cells[0], cells[cells.length - 1], YEAR_OPTIONS, props.locale);
    };

    const page = (direction: 1 | -1) => {
        setMonth(CalendarUtils.stepPage(month, props.precision, direction * PAGE_STEP));
    };

    return (
        <PageCalendarHeader>
            <Button
                id={`${props.itemKey}PreviousPage`}
                ariaLabel={props.previousLabel}
                renderContent={(flags) => <PageButtonContent flags={flags}>◀</PageButtonContent>}
                onClick={() => page(-1)}
            />

            <PageCalendarTitle flags={{}}>{getTitle()}</PageCalendarTitle>

            <Button
                id={`${props.itemKey}NextPage`}
                ariaLabel={props.nextLabel}
                renderContent={(flags) => <PageButtonContent flags={flags}>▶</PageButtonContent>}
                onClick={() => page(1)}
            />
        </PageCalendarHeader>
    );
};
