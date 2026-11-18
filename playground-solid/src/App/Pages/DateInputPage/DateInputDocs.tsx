import { createSignal } from "solid-js";

import type { DateInputFormat, DateValueCalendarId } from "@thewaver/ss-components-solid";
import { DATE_INPUT_FORMATS, DateValueUtils } from "@thewaver/ss-components-solid";
import { DateInputKnobs } from "@thewaver/ss-playground/App/Knobs/DateInputs.const";
import { OTHER_CALENDAR } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import {
    CALENDAR_FIELD_WIDTH,
    DOCS_ROOT,
    DOCS_SECTIONS,
    FORMAT_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/DateInputPage/DateInputPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { CalendarsDocsExample } from "./Docs/Calendars";
import { DayFirstDocsExample } from "./Docs/DayFirst";
import { EraDocsExample } from "./Docs/Era";
import { LabeledDocsExample } from "./Docs/Labeled";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const DateInputDocs = () => {
    const [getIsReadOnly, setIsReadOnly] = createSignal(false);
    const [getHasError, setHasError] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getFormat, setFormat] = createSignal<DateInputFormat>("day_month_year");
    const [getCalendarId, setCalendarId] = createSignal<DateValueCalendarId>(OTHER_CALENDAR);
    const [getIsReachableWhenDisabled, setIsReachableWhenDisabled] = createSignal(false);
    const [getIsTooltipDisabled, setIsTooltipDisabled] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"isReadOnly"} {...DateInputKnobs.IS_READ_ONLY_TEXT}>
                            <PageCheckField value={getIsReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp key={"hasError"} {...DateInputKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...DateInputKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={getIsReadOnly} hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.writtenDayFirst} />

            <PageDocsExample
                path={`${DOCS_ROOT}/DayFirst.tsx`}
                renderKnobs={() => (
                    <PageProp key={"format"} {...DateInputKnobs.FORMAT_TEXT}>
                        <PageSelectField
                            value={getFormat}
                            values={() => [...DATE_INPUT_FORMATS]}
                            width={FORMAT_FIELD_WIDTH}
                            ariaLabel={"Format"}
                            onChange={(format) => setFormat(() => format)}
                        />
                    </PageProp>
                )}
            >
                <DayFirstDocsExample format={getFormat} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.beforeCommonEra} />

            <PageDocsExample path={`${DOCS_ROOT}/Era.tsx`}>
                <EraDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.otherCalendarSystems} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Calendars.tsx`}
                renderKnobs={() => (
                    <PageProp key={"calendar"} {...DateInputKnobs.CALENDAR_TEXT}>
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
                            {...DateInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp key={"tooltipIsDisabled"} {...DateInputKnobs.IS_DISABLED_TEXT}>
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
