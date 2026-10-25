import { createSignal } from "solid-js";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ClockPage/ClockPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { LimitsDocsExample } from "./Docs/Limits";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { TwelveHourDocsExample } from "./Docs/TwelveHour";

export const ClockDocs = () => {
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getIsTwelveHour, setIsTwelveHour] = createSignal(true);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"isDisabled"}
                        label={"Disabled"}
                        hint={"Turns the clock off: no time can be picked, and the Tab key skips it."}
                        controls={"Sets ClockProps.isDisabled"}
                    >
                        <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                    </PageProp>
                )}
            >
                <BasicDocsExample isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Twelve hours"}
                content={
                    "Set [prop]isTwelveHour[/prop] and the hour column reads from 12 through 11, starting at midnight, and a column of its own picks the morning or the afternoon. The value underneath stays a 24-hour time, as the line under the clock shows."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/TwelveHour.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"isTwelveHour"}
                        label={"Twelve hour"}
                        hint={"Reads the hours from 1 to 12, with a column for morning and afternoon."}
                        controls={"Sets ClockProps.isTwelveHour"}
                    >
                        <PageCheckField value={getIsTwelveHour} ariaLabel={"Twelve hour"} onChange={setIsTwelveHour} />
                    </PageProp>
                )}
            >
                <TwelveHourDocsExample isTwelveHour={getIsTwelveHour} />
            </PageDocsExample>

            <PageDocsSection
                title={"Every fifteen minutes, within opening hours"}
                content={
                    "Set [prop]steps[/prop] to offer fewer times in a column, here every fifteen minutes. A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep the time in range: an option is disabled when the time it would pick falls outside them, so with the shop shutting at 17:30, the hour 17 is off whenever the minutes read 45."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Limits.tsx`}>
                <LimitsDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the columns run from the right, so the hours sit on the right, and the left arrow moves on to the next column."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
