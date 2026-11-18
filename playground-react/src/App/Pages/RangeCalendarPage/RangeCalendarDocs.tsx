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
    DOCS_SECTIONS,
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
                        <PageProp itemKey={"weekStartsOn"} {...RangeCalendarKnobs.WEEK_STARTS_ON_TEXT}>
                            <PageSelectField
                                value={weekStartsOn}
                                values={RangeCalendarKnobs.WEEK_STARTS}
                                ariaLabel={"Week starts on"}
                                computeLabel={(day) => WEEK_START_LABELS[day]}
                                onChange={setWeekStartsOn}
                            />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...RangeCalendarKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample weekStartsOn={weekStartsOn} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.earliestLatestDay} />

            <PageDocsExample path={`${DOCS_ROOT}/Bounded.tsx`}>
                <BoundedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.twoMonths} />

            <PageDocsExample path={`${DOCS_ROOT}/TwoMonths.tsx`}>
                <TwoMonthsDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.otherCalendarSystems} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Calendars.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"calendar"} {...RangeCalendarKnobs.CALENDAR_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
