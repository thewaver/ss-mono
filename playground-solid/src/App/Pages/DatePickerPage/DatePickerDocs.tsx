import { createSignal } from "solid-js";

import type { DateValueCalendarId } from "@thewaver/ss-components-solid";
import { DateValueUtils } from "@thewaver/ss-components-solid";
import { DatePickerKnobs } from "@thewaver/ss-playground/App/Knobs/DatePickers.const";
import { OTHER_CALENDAR } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import {
    CALENDAR_FIELD_WIDTH,
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { BoundedDocsExample } from "./Docs/Bounded";
import { CalendarsDocsExample } from "./Docs/Calendars";
import { DisabledDaysDocsExample } from "./Docs/DisabledDays";
import { LabeledDocsExample } from "./Docs/Labeled";
import { MonthPickerDocsExample } from "./Docs/MonthPicker";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const DatePickerDocs = () => {
    const [getIsReadOnly, setIsReadOnly] = createSignal(false);
    const [getHasError, setHasError] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getCalendarId, setCalendarId] = createSignal<DateValueCalendarId>(OTHER_CALENDAR);
    const [getIsReachableWhenDisabled, setIsReachableWhenDisabled] = createSignal(false);
    const [getIsTooltipDisabled, setIsTooltipDisabled] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"isReadOnly"} {...DatePickerKnobs.IS_READ_ONLY_TEXT}>
                            <PageCheckField value={getIsReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp key={"hasError"} {...DatePickerKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...DatePickerKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={getIsReadOnly} hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.earliestLatestDate} />

            <PageDocsExample path={`${DOCS_ROOT}/Bounded.tsx`}>
                <BoundedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.unpickableDays} />

            <PageDocsExample path={`${DOCS_ROOT}/DisabledDays.tsx`}>
                <DisabledDaysDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.pickingMonth} />

            <PageDocsExample path={`${DOCS_ROOT}/MonthPicker.tsx`}>
                <MonthPickerDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.otherCalendarSystems} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Calendars.tsx`}
                renderKnobs={() => (
                    <PageProp key={"calendar"} {...DatePickerKnobs.CALENDAR_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.tooltip} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"tooltipIsReachableWhenDisabled"}
                            {...DatePickerKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp key={"tooltipIsDisabled"} {...DatePickerKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField
                                value={getIsTooltipDisabled}
                                ariaLabel={"Disabled"}
                                onChange={setIsTooltipDisabled}
                            />
                        </PageProp>
                    </>
                )}
            >
                <TooltipDocsExample
                    isDisabled={getIsTooltipDisabled}
                    isReachableWhenDisabled={getIsReachableWhenDisabled}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.namedLabel} />

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>
        </>
    );
};
