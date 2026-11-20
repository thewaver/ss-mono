import { Show, createSignal } from "solid-js";

import type { DateValueRange } from "@thewaver/ss-components-solid";
import { Button, DateValueUtils, RangeCalendar } from "@thewaver/ss-components-solid";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import { MONTH_HEADER_OPTIONS } from "@thewaver/ss-playground/App/Pages/RangeCalendarPage/RangeCalendarPage.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarHeader,
    PageCalendarTitle,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";

const MONTH_COUNT = 2;
const MONTH_STEP = 1;

export const TwoMonthsDocsExample = () => {
    const valueSignal = createSignal<DateValueRange | undefined>();
    const monthSignal = createSignal(DateValueUtils.getStartOfMonth(TODAY));

    const page = (direction: 1 | -1) => {
        monthSignal[1]((prev) => DateValueUtils.addMonths(prev, direction * MONTH_STEP));
    };

    return (
        <PageCalendarFrame>
            <RangeCalendar
                value={valueSignal}
                month={monthSignal}
                today={TODAY}
                locale={LOCALE}
                monthCount={MONTH_COUNT}
                ariaLabel={"Choose a date range"}
                renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                renderMonthHeader={(getMonth, index) => (
                    <PageCalendarHeader>
                        <Show when={index === 0}>
                            <Button
                                id={"twoMonthsPreviousMonth"}
                                ariaLabel={"Previous month"}
                                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>◀</PageButtonContent>}
                                onClick={() => page(-1)}
                            />
                        </Show>

                        <PageCalendarTitle flags={{}}>
                            {DateValueUtils.format(getMonth(), MONTH_HEADER_OPTIONS, LOCALE)}
                        </PageCalendarTitle>

                        <Show when={index === MONTH_COUNT - 1}>
                            <Button
                                id={"twoMonthsNextMonth"}
                                ariaLabel={"Next month"}
                                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>▶</PageButtonContent>}
                                onClick={() => page(1)}
                            />
                        </Show>
                    </PageCalendarHeader>
                )}
            />
        </PageCalendarFrame>
    );
};
