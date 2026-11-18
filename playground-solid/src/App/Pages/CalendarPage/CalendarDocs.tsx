import { createSignal } from "solid-js";

import type {
    DateValueCalendarId,
    DateValueMinDaysInFirstWeek,
    DateValueWeekStart,
} from "@thewaver/ss-components-solid";
import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-solid";
import { CalendarKnobs } from "@thewaver/ss-playground/App/Knobs/Calendars.const";
import {
    CALENDAR_FIELD_WIDTH,
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
    const [getWeekStartsOn, setWeekStartsOn] = createSignal<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getNumberedWeekStartsOn, setNumberedWeekStartsOn] = createSignal<DateValueWeekStart>(
        CALENDAR_DEFAULTS.weekStartsOn,
    );
    const [getMinDaysInFirstWeek, setMinDaysInFirstWeek] = createSignal<DateValueMinDaysInFirstWeek>(
        CALENDAR_DEFAULTS.minDaysInFirstWeek,
    );
    const [getCalendarId, setCalendarId] = createSignal<DateValueCalendarId>(OTHER_CALENDAR);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"weekStartsOn"} {...CalendarKnobs.WEEK_STARTS_ON_TEXT}>
                            <PageSelectField
                                value={getWeekStartsOn}
                                values={() => [...CalendarKnobs.WEEK_STARTS]}
                                ariaLabel={"Week starts on"}
                                computeLabel={(day) => WEEK_START_LABELS[day]}
                                onChange={(day) => setWeekStartsOn(() => day)}
                            />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...CalendarKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample weekStartsOn={getWeekStartsOn} isDisabled={getIsDisabled} />
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
                        <PageProp key={"numberedWeekStartsOn"} {...CalendarKnobs.WEEK_STARTS_ON_TEXT}>
                            <PageSelectField
                                value={getNumberedWeekStartsOn}
                                values={() => [...CalendarKnobs.WEEK_STARTS]}
                                ariaLabel={"Week starts on"}
                                computeLabel={(day) => WEEK_START_LABELS[day]}
                                onChange={(day) => setNumberedWeekStartsOn(() => day)}
                            />
                        </PageProp>

                        <PageProp key={"minDaysInFirstWeek"} {...CalendarKnobs.MIN_DAYS_IN_FIRST_WEEK_TEXT}>
                            <PageSelectField
                                value={getMinDaysInFirstWeek}
                                values={() => [...CalendarKnobs.MIN_DAYS_IN_FIRST_WEEK]}
                                ariaLabel={"First week holds"}
                                computeLabel={(days) => `${days} ${days === 1 ? "day" : "days"}`}
                                onChange={(days) => setMinDaysInFirstWeek(() => days)}
                            />
                        </PageProp>
                    </>
                )}
            >
                <WeekNumbersDocsExample
                    weekStartsOn={getNumberedWeekStartsOn}
                    minDaysInFirstWeek={getMinDaysInFirstWeek}
                />
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
                    <PageProp key={"calendar"} {...CalendarKnobs.CALENDAR_TEXT}>
                        <PageSelectField
                            value={getCalendarId}
                            values={DateValueUtils.getCalendarIds}
                            width={CALENDAR_FIELD_WIDTH}
                            ariaLabel={"Calendar"}
                            onChange={(id) => setCalendarId(() => id)}
                        />
                    </PageProp>
                )}
            >
                <CalendarsDocsExample calendar={getCalendarId} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
