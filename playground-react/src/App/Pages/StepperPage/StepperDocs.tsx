import { useState } from "react";

import { STEPPER_ORIENTATIONS } from "@thewaver/ss-components-react";
import type { StepperOrientation } from "@thewaver/ss-components-react";
import { StepperKnobs } from "@thewaver/ss-playground/App/Knobs/Steppers.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { ArcDocsExample } from "./Docs/Arc";
import { BareDocsExample } from "./Docs/Bare";
import { BasicDocsExample } from "./Docs/Basic";
import { DetailedDocsExample } from "./Docs/Detailed";
import { FailedDocsExample } from "./Docs/Failed";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

const renderFreeNavigationKnob = (key: string, value: boolean, setValue: (value: boolean) => void) => (
    <PageProp itemKey={key} {...StepperKnobs.FREE_NAVIGATION_TEXT}>
        <PageCheckField value={value} ariaLabel={"Free navigation"} onChange={setValue} />
    </PageProp>
);

export const StepperDocs = () => {
    const [orientation, setOrientation] = useState<StepperOrientation>("horizontal");
    const [isFreeNavigation, setIsFreeNavigation] = useState(false);
    const [isRightToLeftFree, setIsRightToLeftFree] = useState(false);
    const [isFailedFree, setIsFailedFree] = useState(false);
    const [isDetailedFree, setIsDetailedFree] = useState(false);
    const [isBareFree, setIsBareFree] = useState(false);
    const [isArcFree, setIsArcFree] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"orientation"} {...StepperKnobs.ORIENTATION_TEXT}>
                            <PageSelectField
                                value={orientation}
                                values={STEPPER_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={(orientation) => setOrientation(orientation)}
                            />
                        </PageProp>

                        {renderFreeNavigationKnob("isFreeNavigation", isFreeNavigation, setIsFreeNavigation)}
                    </>
                )}
            >
                <BasicDocsExample orientation={orientation} isFreeNavigation={isFreeNavigation} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample
                path={`${DOCS_ROOT}/RightToLeft.tsx`}
                renderKnobs={() =>
                    renderFreeNavigationKnob("rightToLeftIsFreeNavigation", isRightToLeftFree, setIsRightToLeftFree)
                }
            >
                <RightToLeftDocsExample isFreeNavigation={isRightToLeftFree} />
            </PageDocsExample>

            <PageDocsSection
                title={"A step that failed"}
                content={
                    "A step's [prop]state[/prop] is yours to invent — here one step failed and one was skipped — and the stepper never looks at what a state means. No ARIA attribute can say that a step failed, so the words have to be in each step's name, which [prop]computeStepAriaLabel[/prop] writes; paint alone is not read out ([wcag id=\"1.3.1\"]WCAG 1.3.1[/wcag]). A step that cannot be pressed but has a tooltip, through [prop]computeTooltipDefs[/prop], stays reachable by the Tab key, so the reason can be read."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Failed.tsx`}
                renderKnobs={() => renderFreeNavigationKnob("failedIsFreeNavigation", isFailedFree, setIsFailedFree)}
            >
                <FailedDocsExample isFreeNavigation={isFailedFree} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.stepsWithOwnContent} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Detailed.tsx`}
                renderKnobs={() =>
                    renderFreeNavigationKnob("detailedIsFreeNavigation", isDetailedFree, setIsDetailedFree)
                }
            >
                <DetailedDocsExample isFreeNavigation={isDetailedFree} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.noConnector} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Bare.tsx`}
                renderKnobs={() => renderFreeNavigationKnob("bareIsFreeNavigation", isBareFree, setIsBareFree)}
            >
                <BareDocsExample isFreeNavigation={isBareFree} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.bentAlongArc} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Arc.tsx`}
                renderKnobs={() => renderFreeNavigationKnob("arcIsFreeNavigation", isArcFree, setIsArcFree)}
            >
                <ArcDocsExample isFreeNavigation={isArcFree} />
            </PageDocsExample>
        </>
    );
};
