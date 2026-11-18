import { useState } from "react";

import { ClockKnobs } from "@thewaver/ss-playground/App/Knobs/Clocks.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/ClockPage/ClockPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { LimitsDocsExample } from "./Docs/Limits";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { TwelveHourDocsExample } from "./Docs/TwelveHour";

export const ClockDocs = () => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [isTwelveHour, setIsTwelveHour] = useState(true);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"isDisabled"} {...ClockKnobs.IS_DISABLED_TEXT}>
                        <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                    </PageProp>
                )}
            >
                <BasicDocsExample isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.twelveHours} />

            <PageDocsExample
                path={`${DOCS_ROOT}/TwelveHour.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"isTwelveHour"} {...ClockKnobs.IS_TWELVE_HOUR_TEXT}>
                        <PageCheckField value={isTwelveHour} ariaLabel={"Twelve hour"} onChange={setIsTwelveHour} />
                    </PageProp>
                )}
            >
                <TwelveHourDocsExample isTwelveHour={isTwelveHour} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.everyFifteenMinutesWithin} />

            <PageDocsExample path={`${DOCS_ROOT}/Limits.tsx`}>
                <LimitsDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
