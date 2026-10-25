import { useState } from "react";

import { STEPPER_ORIENTATIONS } from "@thewaver/ss-components-react";
import type { StepperOrientation } from "@thewaver/ss-components-react";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";

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
    <PageProp
        itemKey={key}
        label={"Free navigation"}
        hint={"Lets any step be pressed to jump to it, rather than only the steps already behind you."}
        controls={"Sets Step.isNavigable on every step sent to StepperProps.steps"}
    >
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
                        <PageProp
                            itemKey={"orientation"}
                            label={"Orientation"}
                            hint={"Whether the steps run across the page or down it."}
                            controls={"Sets StepperProps.orientation"}
                        >
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

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, a strip running across starts from the right: the first step sits at the right-hand end and the connectors lead to the left."
                }
            />

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

            <PageDocsSection
                title={"Steps that carry their own content"}
                content={
                    "Give the stepper [prop]renderBody[/prop] and each step holds a body beside its connector, so the line runs on past the content rather than stopping at it."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Detailed.tsx`}
                renderKnobs={() =>
                    renderFreeNavigationKnob("detailedIsFreeNavigation", isDetailedFree, setIsDetailedFree)
                }
            >
                <DetailedDocsExample isFreeNavigation={isDetailedFree} />
            </PageDocsExample>

            <PageDocsSection
                title={"No connector"}
                content={
                    "The line between steps is optional: leave out [prop]renderConnector[/prop] and nothing is drawn between them, and they sit [prop]gap[/prop] pixels apart."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Bare.tsx`}
                renderKnobs={() => renderFreeNavigationKnob("bareIsFreeNavigation", isBareFree, setIsBareFree)}
            >
                <BareDocsExample isFreeNavigation={isBareFree} />
            </PageDocsExample>

            <PageDocsSection
                title={"Bent along an arc"}
                content={
                    "Give the stepper [prop]computeLayout[/prop] and each step goes where the layout puts it, here along an arc from PlacementLayoutUtils. The connector is handed where the two steps it joins sit, so the run between them follows the curve rather than cutting across it. A step's body has nowhere to go on a curve, so a stepper with a layout takes no [prop]renderBody[/prop]."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Arc.tsx`}
                renderKnobs={() => renderFreeNavigationKnob("arcIsFreeNavigation", isArcFree, setIsArcFree)}
            >
                <ArcDocsExample isFreeNavigation={isArcFree} />
            </PageDocsExample>
        </>
    );
};
