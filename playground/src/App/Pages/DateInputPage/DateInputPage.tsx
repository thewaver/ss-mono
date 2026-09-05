import { createMemo, createSignal } from "solid-js";

import type { DateValue, DateValueCalendarId } from "@thewaver/ss-components";
import { DateValueUtils } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageSelectField } from "../../StyledComponents/Field/Field";
import { CAESAR, TODAY } from "../DatePickerPage/DatePickerPage.const";
import { TypedExample } from "./Examples/Typed";

const CALENDAR_FIELD_WIDTH = 180;
const EXAMPLES_ROOT = "/src/App/Pages/DateInputPage/Examples";

const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

export const DateInputPage = () => {
    const [getCalendarId, setCalendarId] = createSignal<DateValueCalendarId>("gregory");

    const typedSignal = createSignal<DateValue | undefined>(TODAY);
    const localeSignal = createSignal<DateValue | undefined>(TODAY);
    const eraSignal = createSignal<DateValue | undefined>(CAESAR);

    const getExamples = createMemo(() => [
        {
            key: "typed",
            name: "Typed only",
            readout: () =>
                `value: ${describe(typedSignal[0]())} — a half-typed or impossible date leaves this value alone`,
            component: () => (
                <TypedExample valueSignal={typedSignal} calendar={getCalendarId} ariaLabel={"Start date"} />
            ),
            path: `${EXAMPLES_ROOT}/Typed.tsx`,
        },
        {
            key: "locale",
            name: "Day first",
            readout: () =>
                `value: ${describe(localeSignal[0]())} — dd/mm/yyyy, and the separators are the mask's rather than yours to type`,
            component: () => (
                <TypedExample
                    valueSignal={localeSignal}
                    calendar={getCalendarId}
                    format={"day-month-year"}
                    ariaLabel={"Day-first date"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Typed.tsx`,
        },
        {
            key: "era",
            name: "Before the common era",
            readout: () =>
                `value: ${describe(eraSignal[0]())} — the era is a control in the leading slot, offering whatever the calendar reports`,
            component: () => (
                <TypedExample valueSignal={eraSignal} calendar={getCalendarId} ariaLabel={"Historical date"} />
            ),
            path: `${EXAMPLES_ROOT}/Typed.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"calendarId"} label={"Calendar"}>
                    <PageSelectField
                        value={getCalendarId}
                        values={DateValueUtils.getCalendarIds}
                        width={() => CALENDAR_FIELD_WIDTH}
                        ariaLabel={"Calendar"}
                        onChange={(id) => setCalendarId(() => id)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
