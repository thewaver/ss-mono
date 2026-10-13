import { Button, CalendarUtils, DateValueUtils, access } from "@thewaver/ss-components-solid";
import {
    MONTH_TITLE_OPTIONS,
    PAGE_STEP,
    WEEK_STARTS_ON,
    YEAR_OPTIONS,
} from "@thewaver/ss-playground/App/PageComponents/CalendarCaption/CalendarCaption.const";

import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageCalendarHeader, PageCalendarTitle } from "../../StyledComponents/CalendarContent/CalendarContent";
import type { PageCalendarPagedCaptionProps } from "./CalendarPagedCaption.types";

export const PageCalendarPagedCaption = (props: PageCalendarPagedCaptionProps) => {
    const getMonth = () => props.month[0]();

    const getTitle = () => {
        const precision = access(props.precision);
        const locale = access(props.locale);

        if (precision === "day") return DateValueUtils.format(getMonth(), MONTH_TITLE_OPTIONS, locale);
        if (precision === "month") return DateValueUtils.format(getMonth(), YEAR_OPTIONS, locale);

        const cells = CalendarUtils.getCells(getMonth(), precision, WEEK_STARTS_ON);

        return CalendarUtils.formatSpan(cells[0], cells[cells.length - 1], YEAR_OPTIONS, locale);
    };

    const page = (direction: 1 | -1) => {
        props.month[1]((prev) => CalendarUtils.stepPage(prev, access(props.precision), direction * PAGE_STEP));
    };

    return (
        <PageCalendarHeader>
            <Button
                id={() => `${access(props.key)}PreviousPage`}
                ariaLabel={props.previousLabel}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>◀</PageButtonContent>}
                onClick={() => page(-1)}
            />

            <PageCalendarTitle flags={{}}>{getTitle()}</PageCalendarTitle>

            <Button
                id={() => `${access(props.key)}NextPage`}
                ariaLabel={props.nextLabel}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>▶</PageButtonContent>}
                onClick={() => page(1)}
            />
        </PageCalendarHeader>
    );
};
