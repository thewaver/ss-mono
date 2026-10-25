import { useState } from "react";

import { ProgressKnobs } from "@thewaver/ss-playground/App/Knobs/Progresses.const";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";

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

export const ProgressDocs = () => {
    const [value, setValue] = useState(ProgressKnobs.STARTING_VALUE);
    const [hasError, setHasError] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"value"}
                            label={"Value"}
                            hint={"How far along the work is, between 0 and 1, the default range."}
                            controls={"Sets ProgressProps.value"}
                        >
                            <PageNumberField
                                value={value}
                                min={ProgressKnobs.MIN_VALUE}
                                max={ProgressKnobs.MAX_VALUE}
                                step={ProgressKnobs.VALUE_STEP}
                                ariaLabel={"Value"}
                                onInput={setValue}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"hasError"}
                            label={"Error"}
                            hint={
                                "Puts the bar in its error look, for work that has failed rather than finished. Whether it has failed is the owner's to say."
                            }
                            controls={"Sets ProgressProps.hasError"}
                        >
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample value={value} hasError={hasError} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={"Inside a box whose text runs right to left, the bar fills from the right."}
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Work of unknown length"}
                content={
                    "Leave [prop]value[/prop] out and the bar is indeterminate. A screen reader hears no number, and the painter is handed no ratio, so it can animate instead."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Indeterminate.tsx`}>
                <IndeterminateDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Counting in real units"}
                content={
                    "Set [prop]min[/prop] and [prop]max[/prop] to the units the work is counted in, bytes here, and pass the count straight in; the painter is still handed a ratio from 0 to 1. Where the bare number would mean nothing to a listener, [prop]ariaValueText[/prop] says what to read out instead, shown here under the bar."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/LiveRange.tsx`}>
                <LiveRangeDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"A value past either end"}
                content={
                    "A value outside [prop]min[/prop] and [prop]max[/prop] is clamped, so the bar is drawn full rather than past its end, and the ratio the painter is handed never leaves 0 to 1. This one is handed 5 against the default range of 0 to 1."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/OutOfRange.tsx`}>
                <OutOfRangeDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"A reading rather than a task"}
                content={
                    "Set [prop]role[/prop] to meter for a reading of how full something is, disk space here, rather than work that will finish. A screen reader hears it as a gauge, and since a gauge always reads something, [prop]value[/prop] is then required."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/DiskMeter.tsx`}>
                <DiskMeterDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Drawn as a ring"}
                content={
                    "What the progress looks like is the painter's to decide: here the same upload is drawn round a circle, and nothing about the component changes."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Ring.tsx`}>
                <RingDocsExample />
            </PageDocsExample>
        </>
    );
};
