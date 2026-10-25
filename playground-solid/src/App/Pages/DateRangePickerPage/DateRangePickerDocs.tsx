import { createSignal } from "solid-js";

import type { DateValueCalendarId } from "@thewaver/ss-components-solid";
import { DateValueUtils } from "@thewaver/ss-components-solid";
import { OTHER_CALENDAR } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import {
    CALENDAR_FIELD_WIDTH,
    DOCS_ROOT,
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
                        <PageProp
                            key={"isReadOnly"}
                            label={"Read-only"}
                            hint={
                                "Its dates can be selected and copied, but neither typing nor pasting changes them, and the calendar cannot be opened."
                            }
                            controls={"Sets DateRangePickerProps.isReadOnly"}
                        >
                            <PageCheckField value={getIsReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp
                            key={"hasError"}
                            label={"Error"}
                            hint={
                                "Marks both fields invalid, for screen readers as well as for the painter. Each field also marks itself while what it shows is not a date."
                            }
                            controls={"Sets DateRangePickerProps.hasError"}
                        >
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            key={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the picker off: nothing can write to either field, the calendar cannot be opened, and the Tab key skips all three."
                            }
                            controls={"Sets DateRangePickerProps.isDisabled"}
                        >
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={getIsReadOnly} hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Earliest and latest date"}
                content={
                    "A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep both ends between them. The calendar disables the days outside, and a date typed outside them is moved to the nearest of the two once its field is left."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Bounded.tsx`}>
                <BoundedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Other calendar systems"}
                content={
                    "Set [prop]calendar[/prop] and both fields read and write their dates in that calendar system, and the calendar opens on that system's month. The value stays the same two days, as the line under the fields shows."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Calendars.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"calendar"}
                        label={"Calendar"}
                        hint={"Which calendar system the dates are read and written in."}
                        controls={"Sets DateRangePickerProps.calendar"}
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
                    "Inside a box whose text runs right to left, the start field sits on the right, where reading starts, the end field and the calendar's trigger on the left, each field's text lines up on the right, and the calendar opens under the right edge of the pair."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Tooltip"}
                content={
                    "Give a picker [prop]tooltipDefs[/prop] and one tooltip shows over both fields while either is hovered or holds keyboard focus, read by screen readers as the description of whichever field is focused. A disabled picker shows no tooltip unless you also keep it reachable when disabled; its fields can then be focused to read why it is off, and typing still changes nothing."
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
                                "Keeps a disabled picker's tooltip available: the Tab key can stop on its fields and hovering them shows the tooltip. Without it a disabled picker shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets DateRangePickerProps.isReachableWhenDisabled"}
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
                                "Turns the picker off: nothing can write to either field, the calendar cannot be opened, and the Tab key skips all three."
                            }
                            controls={"Sets DateRangePickerProps.isDisabled"}
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
        </>
    );
};
