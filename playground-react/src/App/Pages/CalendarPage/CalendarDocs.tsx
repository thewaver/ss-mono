import { useState } from "react";

import type {
    DateValueCalendarId,
    DateValueMinDaysInFirstWeek,
    DateValueWeekStart,
} from "@thewaver/ss-components-react";
import { CALENDAR_DEFAULTS } from "@thewaver/ss-components-react";
import { CalendarKnobs } from "@thewaver/ss-playground/App/Knobs/Calendars.const";
import {
    CALENDAR_FIELD_WIDTH,
    CALENDAR_IDS,
    DOCS_ROOT,
    DOCS_SECTIONS,
    OTHER_CALENDAR,
    WEEK_START_LABELS,
} from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { BoundedDocsExample } from "./Docs/Bounded";
import { CalendarsDocsExample } from "./Docs/Calendars";
import { DisabledDaysDocsExample } from "./Docs/DisabledDays";
import { MonthPickerDocsExample } from "./Docs/MonthPicker";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { WeekNumbersDocsExample } from "./Docs/WeekNumbers";
import { YearPickerDocsExample } from "./Docs/YearPicker";

export const CalendarDocs = () => {
    const [weekStartsOn, setWeekStartsOn] = useState<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);
    const [isDisabled, setIsDisabled] = useState(false);
    const [numberedWeekStartsOn, setNumberedWeekStartsOn] = useState<DateValueWeekStart>(
        CALENDAR_DEFAULTS.weekStartsOn,
    );
    const [minDaysInFirstWeek, setMinDaysInFirstWeek] = useState<DateValueMinDaysInFirstWeek>(
        CALENDAR_DEFAULTS.minDaysInFirstWeek,
    );
    const [calendarId, setCalendarId] = useState<DateValueCalendarId>(OTHER_CALENDAR);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"weekStartsOn"} {...CalendarKnobs.WEEK_STARTS_ON_TEXT}>
                            <PageSelectField
                                value={weekStartsOn}
                                values={CalendarKnobs.WEEK_STARTS}
                                ariaLabel={"Week starts on"}
                                computeLabel={(day) => WEEK_START_LABELS[day]}
                                onChange={setWeekStartsOn}
                            />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...CalendarKnobs.IS_DISABLED_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.unpickableDays} />

            <PageDocsExample path={`${DOCS_ROOT}/DisabledDays.tsx`}>
                <DisabledDaysDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.weekNumbers} />

            <PageDocsExample
                path={`${DOCS_ROOT}/WeekNumbers.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"numberedWeekStartsOn"} {...CalendarKnobs.WEEK_STARTS_ON_TEXT}>
                            <PageSelectField
                                value={numberedWeekStartsOn}
                                values={CalendarKnobs.WEEK_STARTS}
                                ariaLabel={"Week starts on"}
                                computeLabel={(day) => WEEK_START_LABELS[day]}
                                onChange={setNumberedWeekStartsOn}
                            />
                        </PageProp>

                        <PageProp itemKey={"minDaysInFirstWeek"} {...CalendarKnobs.MIN_DAYS_IN_FIRST_WEEK_TEXT}>
                            <PageSelectField
                                value={minDaysInFirstWeek}
                                values={CalendarKnobs.MIN_DAYS_IN_FIRST_WEEK}
                                ariaLabel={"First week holds"}
                                computeLabel={(days) => `${days} ${days === 1 ? "day" : "days"}`}
                                onChange={setMinDaysInFirstWeek}
                            />
                        </PageProp>
                    </>
                )}
            >
                <WeekNumbersDocsExample weekStartsOn={numberedWeekStartsOn} minDaysInFirstWeek={minDaysInFirstWeek} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.pickingMonth} />

            <PageDocsExample path={`${DOCS_ROOT}/MonthPicker.tsx`}>
                <MonthPickerDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.pickingYear} />

            <PageDocsExample path={`${DOCS_ROOT}/YearPicker.tsx`}>
                <YearPickerDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.otherCalendarSystems} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Calendars.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"calendar"} {...CalendarKnobs.CALENDAR_TEXT}>
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
