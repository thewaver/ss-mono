import { useState } from "react";

import type { DateInputFormat, DateValueCalendarId } from "@thewaver/ss-components-react";
import { DATE_INPUT_FORMATS, DateValueUtils } from "@thewaver/ss-components-react";
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
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [format, setFormat] = useState<DateInputFormat>("day_month_year");
    const [calendarId, setCalendarId] = useState<DateValueCalendarId>(OTHER_CALENDAR);
    const [isReachableWhenDisabled, setIsReachableWhenDisabled] = useState(false);
    const [isTooltipDisabled, setIsTooltipDisabled] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"isReadOnly"}
                            label={"Read-only"}
                            hint={"Its date can be selected and copied, but neither typing nor pasting changes it."}
                            controls={"Sets DateInputProps.isReadOnly"}
                        >
                            <PageCheckField value={isReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp
                            itemKey={"hasError"}
                            label={"Error"}
                            hint={
                                "Marks the field invalid, for screen readers as well as for the painter. The field also marks itself while what it shows is not a date."
                            }
                            controls={"Sets DateInputProps.hasError"}
                        >
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                            }
                            controls={"Sets DateInputProps.isDisabled"}
                        >
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={isReadOnly} hasError={hasError} isDisabled={isDisabled} />
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
                        itemKey={"format"}
                        label={"Format"}
                        hint={"The order the parts of the date are typed in, and the separator between them."}
                        controls={"Sets DateInputProps.format"}
                    >
                        <PageSelectField
                            value={format}
                            values={DATE_INPUT_FORMATS}
                            width={FORMAT_FIELD_WIDTH}
                            ariaLabel={"Format"}
                            onChange={setFormat}
                        />
                    </PageProp>
                )}
            >
                <DayFirstDocsExample format={format} />
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
                        itemKey={"calendar"}
                        label={"Calendar"}
                        hint={"Which calendar system the date is read and written in."}
                        controls={"Sets DateInputProps.calendar"}
                    >
                        <PageSelectField
                            value={calendarId}
                            values={DateValueUtils.getCalendarIds()}
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
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            label={"Reachable when disabled"}
                            hint={
                                "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets DateInputProps.isReachableWhenDisabled"}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"tooltipIsDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                            }
                            controls={"Sets DateInputProps.isDisabled"}
                        >
                            <PageCheckField
                                value={isTooltipDisabled}
                                ariaLabel={"Disabled"}
                                onChange={setIsTooltipDisabled}
                            />
                        </PageProp>
                    </>
                )}
            >
                <TooltipDocsExample isDisabled={isTooltipDisabled} isReachableWhenDisabled={isReachableWhenDisabled} />
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
