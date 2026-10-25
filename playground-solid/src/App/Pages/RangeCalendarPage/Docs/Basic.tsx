import { createSignal } from "solid-js";

import type { DateValueRange } from "@thewaver/ss-components-solid";
import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { RangeCalendarBasicDocsExampleProps } from "../RangeCalendarPageSolid.types";

type Props = RangeCalendarBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueSignal = createSignal<DateValueRange | undefined>();
    const monthSignal = createSignal(DateValueUtils.getStartOfMonth(TODAY));

    const getValueText = () => {
        const value = valueSignal[0]();

        return value ? `${DateValueUtils.toIso(value.start)} to ${DateValueUtils.toIso(value.end)}` : "nothing";
    };

    return (
        <>
            <PageCalendarFrame>
                <PageCalendarCaption month={monthSignal} key={"basic"} locale={LOCALE} />

                <RangeCalendar
                    value={valueSignal}
                    month={monthSignal}
                    today={TODAY}
                    locale={LOCALE}
                    weekStartsOn={props.weekStartsOn}
                    isDisabled={props.isDisabled}
                    ariaLabel={"Choose a date range"}
                    renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
                    renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                />
            </PageCalendarFrame>

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: ${getValueText()}`}
            </div>
        </>
    );
};
