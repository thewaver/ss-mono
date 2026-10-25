import { useState } from "react";

import type { DateValueRange } from "@thewaver/ss-components-react";
import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { RangeCalendarBasicDocsExampleProps } from "../RangeCalendarPageReact.types";

type Props = RangeCalendarBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueState = useState<DateValueRange | undefined>();
    const monthState = useState(DateValueUtils.getStartOfMonth(TODAY));

    const [value] = valueState;

    const valueText = value ? `${DateValueUtils.toIso(value.start)} to ${DateValueUtils.toIso(value.end)}` : "nothing";

    return (
        <>
            <PageCalendarFrame>
                <PageCalendarCaption month={monthState} itemKey={"basic"} locale={LOCALE} />

                <RangeCalendar
                    value={valueState}
                    month={monthState}
                    today={TODAY}
                    locale={LOCALE}
                    weekStartsOn={props.weekStartsOn}
                    isDisabled={props.isDisabled}
                    ariaLabel={"Choose a date range"}
                    renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                    renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                />
            </PageCalendarFrame>

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueText}`}
            </div>
        </>
    );
};
