import { useState } from "react";

import type { DateValueCalendarId, DateValueWeekStart } from "@thewaver/ss-components-react";
import { CALENDAR_DEFAULTS } from "@thewaver/ss-components-react";
import { RangeCalendarKnobs } from "@thewaver/ss-playground/App/Knobs/RangeCalendars.const";
import {
    CALENDAR_IDS,
    OTHER_CALENDAR,
    WEEK_START_LABELS,
} from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import {
    CALENDAR_FIELD_WIDTH,
    DOCS_ROOT,
} from "@thewaver/ss-playground/App/Pages/RangeCalendarPage/RangeCalendarPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { BoundedDocsExample } from "./Docs/Bounded";
import { CalendarsDocsExample } from "./Docs/Calendars";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { TwoMonthsDocsExample } from "./Docs/TwoMonths";

export const RangeCalendarDocs = () => {
    const [weekStartsOn, setWeekStartsOn] = useState<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);
    const [isDisabled, setIsDisabled] = useState(false);
    const [calendarId, setCalendarId] = useState<DateValueCalendarId>(OTHER_CALENDAR);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"weekStartsOn"}
                            label={"Week starts on"}
                            hint={"Which day begins a week, which decides the order of the column headings."}
                            controls={"Sets RangeCalendarProps.weekStartsOn"}
                        >
                            <PageSelectField
                                value={weekStartsOn}
                                values={RangeCalendarKnobs.WEEK_STARTS}
                                ariaLabel={"Week starts on"}
                                computeLabel={(day) => WEEK_START_LABELS[day]}
                                onChange={setWeekStartsOn}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={"Turns the calendar off: no day can be picked, and the Tab key skips it."}
                            controls={"Sets RangeCalendarProps.isDisabled"}
                        >
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample weekStartsOn={weekStartsOn} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Earliest and latest day"}
                content={
                    "A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep both ends of the range between them: the days outside are disabled, and the arrow and page keys stop at the edge."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Bounded.tsx`}>
                <BoundedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Two months"}
                content={
                    "Set [prop]monthCount[/prop] to show several months side by side, so a range can start in one and end in the next. The arrow keys walk from one month into the other, the page keys step them all, and [prop]renderMonthHeader[/prop] draws the title over each."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/TwoMonths.tsx`}>
                <TwoMonthsDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Other calendar systems"}
                content={
                    "The grid draws the month of whichever calendar the [prop]month[/prop] it is handed is in. Here the month is converted to the chosen calendar, and a range picked in one calendar covers the same days in any other."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Calendars.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"calendar"}
                        label={"Calendar"}
                        hint={"Which calendar system the month is drawn in."}
                        controls={"Converts RangeCalendarProps.month to the chosen calendar"}
                    >
                        <PageSelectField
                            value={calendarId}
                            values={CALENDAR_IDS}
                            width={CALENDAR_FIELD_WIDTH}
                            ariaLabel={"Calendar"}
                            onChange={setCalendarId}
                        />
                    </PageProp>
                )}
            >
                <CalendarsDocsExample calendar={calendarId} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, each week runs from the right, and the left arrow moves on to the next day, which is where it is drawn. Up, down and the page keys keep their meaning."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
