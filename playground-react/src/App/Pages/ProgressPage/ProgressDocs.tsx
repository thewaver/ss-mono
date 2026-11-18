import { useState } from "react";

import { ProgressKnobs } from "@thewaver/ss-playground/App/Knobs/Progresses.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { DiskMeterDocsExample } from "./Docs/DiskMeter";
import { IndeterminateDocsExample } from "./Docs/Indeterminate";
import { LiveRangeDocsExample } from "./Docs/LiveRange";
import { OutOfRangeDocsExample } from "./Docs/OutOfRange";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { RingDocsExample } from "./Docs/Ring";
import { VerticalDocsExample } from "./Docs/Vertical";

export const ProgressDocs = () => {
    const [value, setValue] = useState(ProgressKnobs.STARTING_VALUE);
    const [hasError, setHasError] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"value"} {...ProgressKnobs.VALUE_TEXT}>
                            <PageNumberField
                                value={value}
                                min={ProgressKnobs.MIN_VALUE}
                                max={ProgressKnobs.MAX_VALUE}
                                step={ProgressKnobs.VALUE_STEP}
                                ariaLabel={"Value"}
                                onInput={setValue}
                            />
                        </PageProp>

                        <PageProp itemKey={"hasError"} {...ProgressKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample value={value} hasError={hasError} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.standingUpright} />

            <PageDocsExample path={`${DOCS_ROOT}/Vertical.tsx`}>
                <VerticalDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.workUnknownLength} />

            <PageDocsExample path={`${DOCS_ROOT}/Indeterminate.tsx`}>
                <IndeterminateDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.countingRealUnits} />

            <PageDocsExample path={`${DOCS_ROOT}/LiveRange.tsx`}>
                <LiveRangeDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.valuePastEitherEnd} />

            <PageDocsExample path={`${DOCS_ROOT}/OutOfRange.tsx`}>
                <OutOfRangeDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.readingRatherThanTask} />

            <PageDocsExample path={`${DOCS_ROOT}/DiskMeter.tsx`}>
                <DiskMeterDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.drawnRing} />

            <PageDocsExample path={`${DOCS_ROOT}/Ring.tsx`}>
                <RingDocsExample />
            </PageDocsExample>
        </>
    );
};
