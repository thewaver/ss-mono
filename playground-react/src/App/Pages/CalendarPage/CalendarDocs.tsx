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
                        <PageProp
                            itemKey={"weekStartsOn"}
                            label={"Week starts on"}
                            hint={"Which day begins a week, which decides the order of the column headings."}
                            controls={"Sets CalendarProps.weekStartsOn"}
                        >
                            <PageSelectField
                                value={weekStartsOn}
                                values={CalendarKnobs.WEEK_STARTS}
                                ariaLabel={"Week starts on"}
                                computeLabel={(day) => WEEK_START_LABELS[day]}
                                onChange={setWeekStartsOn}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={"Turns the calendar off: no day can be picked, and the Tab key skips it."}
                            controls={"Sets CalendarProps.isDisabled"}
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
                    "A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep the pick between them: the days outside are disabled, and the arrow and page keys stop at the edge."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Bounded.tsx`}>
                <BoundedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Days that cannot be picked"}
                content={
                    "List the days to refuse in [prop]disabledDays[/prop]: a date, a span from one date to another, everything before or after a date, or days of the week, here Saturday and Sunday. A rule none of those can describe goes in [prop]computeIsDayDisabled[/prop], which is asked about every day shown, so keep it quick."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/DisabledDays.tsx`}>
                <DisabledDaysDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Week numbers"}
                content={
                    "Draw [prop]renderWeekNumber[/prop] and each week is headed by its number. Countries count weeks differently, so two settings decide it: [prop]weekStartsOn[/prop], the day a week begins, and [prop]minDaysInFirstWeek[/prop], how many days of the new year the first week must hold. Monday and 4 is ISO 8601, used across most of Europe; Sunday and 1 is the count used in the United States."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/WeekNumbers.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"numberedWeekStartsOn"}
                            label={"Week starts on"}
                            hint={"Which day begins a week, which decides the order of the column headings."}
                            controls={"Sets CalendarProps.weekStartsOn"}
                        >
                            <PageSelectField
                                value={numberedWeekStartsOn}
                                values={CalendarKnobs.WEEK_STARTS}
                                ariaLabel={"Week starts on"}
                                computeLabel={(day) => WEEK_START_LABELS[day]}
                                onChange={setNumberedWeekStartsOn}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"minDaysInFirstWeek"}
                            label={"First week holds"}
                            hint={
                                "How many days of the new year the first week must hold, which decides the week numbers."
                            }
                            controls={"Sets CalendarProps.minDaysInFirstWeek"}
                        >
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

            <PageDocsSection
                title={"Picking a month"}
                content={
                    "Set [prop]precision[/prop] to month and the grid holds the year's months, three to a row. A pick sets the first day of that month, and the page keys step a year."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/MonthPicker.tsx`}>
                <MonthPickerDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Picking a year"}
                content={
                    "Set [prop]precision[/prop] to year and the grid holds twelve years, three to a row, and a pick sets the first day of that year. The limits still apply: here only the years from 2019 to 2031 can be picked."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/YearPicker.tsx`}>
                <YearPickerDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Other calendar systems"}
                content={
                    "A date carries its own calendar system, and the grid draws the month of whichever calendar the [prop]month[/prop] it is handed is in: its length, its name and its year. Here the month is converted to the chosen calendar, and the picked day stays the same day in any of them."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Calendars.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"calendar"}
                        label={"Calendar"}
                        hint={"Which calendar system the month is drawn in."}
                        controls={"Converts CalendarProps.month to the chosen calendar"}
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
                    "Inside a box whose text runs right to left, each week runs from the right, and the right arrow moves to the day before, which is where it is drawn. Up, down and the page keys keep their meaning."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
