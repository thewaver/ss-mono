import { createSignal } from "solid-js";

import type { DateValueCalendarId, DateValueWeekStart } from "@thewaver/ss-components-solid";
import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-solid";
import { RangeCalendarKnobs } from "@thewaver/ss-playground/App/Knobs/RangeCalendars.const";
import { OTHER_CALENDAR, WEEK_START_LABELS } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
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
    const [getWeekStartsOn, setWeekStartsOn] = createSignal<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getCalendarId, setCalendarId] = createSignal<DateValueCalendarId>(OTHER_CALENDAR);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"weekStartsOn"} {...RangeCalendarKnobs.WEEK_STARTS_ON_TEXT}>
                            <PageSelectField
                                value={getWeekStartsOn}
                                values={() => [...RangeCalendarKnobs.WEEK_STARTS]}
                                ariaLabel={"Week starts on"}
                                computeLabel={(day) => WEEK_START_LABELS[day]}
                                onChange={(day) => setWeekStartsOn(() => day)}
                            />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...RangeCalendarKnobs.IS_DISABLED_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.twoMonths} />

            <PageDocsExample path={`${DOCS_ROOT}/TwoMonths.tsx`}>
                <TwoMonthsDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.otherCalendarSystems} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Calendars.tsx`}
                renderKnobs={() => (
                    <PageProp key={"calendar"} {...RangeCalendarKnobs.CALENDAR_TEXT}>
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
