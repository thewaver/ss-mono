import { createSignal } from "solid-js";

import type { DateValueCalendarId } from "@thewaver/ss-components-solid";
import { DateValueUtils } from "@thewaver/ss-components-solid";
import { DateRangePickerKnobs } from "@thewaver/ss-playground/App/Knobs/DateRangePickers.const";
import { OTHER_CALENDAR } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import {
    CALENDAR_FIELD_WIDTH,
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/DateRangePickerPage/DateRangePickerPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { BoundedDocsExample } from "./Docs/Bounded";
import { CalendarsDocsExample } from "./Docs/Calendars";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const DateRangePickerDocs = () => {
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
                        <PageProp key={"isReadOnly"} {...DateRangePickerKnobs.IS_READ_ONLY_TEXT}>
                            <PageCheckField value={getIsReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp key={"hasError"} {...DateRangePickerKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...DateRangePickerKnobs.IS_DISABLED_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.otherCalendarSystems} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Calendars.tsx`}
                renderKnobs={() => (
                    <PageProp key={"calendar"} {...DateRangePickerKnobs.CALENDAR_TEXT}>
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
                            {...DateRangePickerKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp key={"tooltipIsDisabled"} {...DateRangePickerKnobs.IS_DISABLED_TEXT}>
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
        </>
    );
};
