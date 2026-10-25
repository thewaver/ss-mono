import { createSignal } from "solid-js";

import type { DateInputFormat, DateValueCalendarId } from "@thewaver/ss-components-solid";
import { DATE_INPUT_FORMATS, DateValueUtils } from "@thewaver/ss-components-solid";
import { OTHER_CALENDAR } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import {
    CALENDAR_FIELD_WIDTH,
    DOCS_ROOT,
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
                        <PageProp
                            key={"isReadOnly"}
                            label={"Read-only"}
                            hint={"Its date can be selected and copied, but neither typing nor pasting changes it."}
                            controls={"Sets DateInputProps.isReadOnly"}
                        >
                            <PageCheckField value={getIsReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp
                            key={"hasError"}
                            label={"Error"}
                            hint={
                                "Marks the field invalid, for screen readers as well as for the painter. The field also marks itself while what it shows is not a date."
                            }
                            controls={"Sets DateInputProps.hasError"}
                        >
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            key={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                            }
                            controls={"Sets DateInputProps.isDisabled"}
                        >
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={getIsReadOnly} hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Written day first"}
                content={
                    "The parts of the date are typed in the order [prop]format[/prop] names: year first by default, or day first, or month first. Only digits are typed, and the field adds each separator as soon as the part before it is complete. The value is the same date in any order, as the line under the field shows."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/DayFirst.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"format"}
                        label={"Format"}
                        hint={"The order the parts of the date are typed in, and the separator between them."}
                        controls={"Sets DateInputProps.format"}
                    >
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

            <PageDocsSection
                title={"Before the common era"}
                content={
                    "A date carries its era, and the digits typed cannot say which one it is. Draw a control in [prop]renderLeading[/prop], which is handed the date's era, the eras its calendar offers and a way to change it, and this date of 44 BC can be moved to AD and back."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Era.tsx`}>
                <EraDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Other calendar systems"}
                content={
                    "Set [prop]calendar[/prop] and the date is read and written in that calendar system while the value stays the same day, as the line under the field shows. A calendar with one era, such as the Hebrew one, gives the era control nothing to offer, so it is not drawn."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Calendars.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"calendar"}
                        label={"Calendar"}
                        hint={"Which calendar system the date is read and written in."}
                        controls={"Sets DateInputProps.calendar"}
                    >
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

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the leading content moves to the right, where reading starts, and the text lines up on the right. The date is still written year first, since digits run left to right in either direction."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Tooltip"}
                content={
                    "Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and typing still changes nothing."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"tooltipIsReachableWhenDisabled"}
                            label={"Reachable when disabled"}
                            hint={
                                "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets DateInputProps.isReachableWhenDisabled"}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp
                            key={"tooltipIsDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                            }
                            controls={"Sets DateInputProps.isDisabled"}
                        >
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

            <PageDocsSection
                title={"Named by a Label"}
                content={
                    "Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text focuses the field."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>
        </>
    );
};
