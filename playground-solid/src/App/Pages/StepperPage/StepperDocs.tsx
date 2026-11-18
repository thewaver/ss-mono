import { type Accessor, type Setter, createSignal } from "solid-js";

import { STEPPER_ORIENTATIONS } from "@thewaver/ss-components-solid";
import type { StepperOrientation } from "@thewaver/ss-components-solid";
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

const renderFreeNavigationKnob = (key: string, getValue: Accessor<boolean>, setValue: Setter<boolean>) => (
    <PageProp key={key} {...StepperKnobs.FREE_NAVIGATION_TEXT}>
        <PageCheckField value={getValue} ariaLabel={"Free navigation"} onChange={setValue} />
    </PageProp>
);

export const StepperDocs = () => {
    const [getOrientation, setOrientation] = createSignal<StepperOrientation>("horizontal");
    const [getIsFreeNavigation, setIsFreeNavigation] = createSignal(false);
    const [getIsRightToLeftFree, setIsRightToLeftFree] = createSignal(false);
    const [getIsFailedFree, setIsFailedFree] = createSignal(false);
    const [getIsDetailedFree, setIsDetailedFree] = createSignal(false);
    const [getIsBareFree, setIsBareFree] = createSignal(false);
    const [getIsArcFree, setIsArcFree] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"orientation"} {...StepperKnobs.ORIENTATION_TEXT}>
                            <PageSelectField
                                value={getOrientation}
                                values={STEPPER_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={(orientation) => setOrientation(() => orientation)}
                            />
                        </PageProp>

                        {renderFreeNavigationKnob("isFreeNavigation", getIsFreeNavigation, setIsFreeNavigation)}
                    </>
                )}
            >
                <BasicDocsExample orientation={getOrientation} isFreeNavigation={getIsFreeNavigation} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample
                path={`${DOCS_ROOT}/RightToLeft.tsx`}
                renderKnobs={() =>
                    renderFreeNavigationKnob("rightToLeftIsFreeNavigation", getIsRightToLeftFree, setIsRightToLeftFree)
                }
            >
                <RightToLeftDocsExample isFreeNavigation={getIsRightToLeftFree} />
            </PageDocsExample>

            <PageDocsSection
                title={"A step that failed"}
                content={
                    "A step's [prop]state[/prop] is yours to invent — here one step failed and one was skipped — and the stepper never looks at what a state means. No ARIA attribute can say that a step failed, so the words have to be in each step's name, which [prop]computeStepAriaLabel[/prop] writes; paint alone is not read out ([wcag id=\"1.3.1\"]WCAG 1.3.1[/wcag]). A step that cannot be pressed but has a tooltip, through [prop]computeTooltipDefs[/prop], stays reachable by the Tab key, so the reason can be read."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Failed.tsx`}
                renderKnobs={() => renderFreeNavigationKnob("failedIsFreeNavigation", getIsFailedFree, setIsFailedFree)}
            >
                <FailedDocsExample isFreeNavigation={getIsFailedFree} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.stepsWithOwnContent} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Detailed.tsx`}
                renderKnobs={() =>
                    renderFreeNavigationKnob("detailedIsFreeNavigation", getIsDetailedFree, setIsDetailedFree)
                }
            >
                <DetailedDocsExample isFreeNavigation={getIsDetailedFree} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.noConnector} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Bare.tsx`}
                renderKnobs={() => renderFreeNavigationKnob("bareIsFreeNavigation", getIsBareFree, setIsBareFree)}
            >
                <BareDocsExample isFreeNavigation={getIsBareFree} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.bentAlongArc} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Arc.tsx`}
                renderKnobs={() => renderFreeNavigationKnob("arcIsFreeNavigation", getIsArcFree, setIsArcFree)}
            >
                <ArcDocsExample isFreeNavigation={getIsArcFree} />
            </PageDocsExample>
        </>
    );
};
