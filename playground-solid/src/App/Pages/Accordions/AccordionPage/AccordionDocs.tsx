import { createSignal } from "solid-js";

import { ACCORDION_ORIENTATIONS, COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-solid";
import type { AccordionOrientation } from "@thewaver/ss-components-solid";
import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
import {
    ACCORDION_POLICIES,
    DEFAULT_ACCORDION_POLICY,
    DOCS_ROOT,
    DOCS_SECTIONS,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import type { AccordionPolicy } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.types";
import { AccordionPageUtils } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.utils";

import { PageDocsExample } from "../../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { ControlledDocsExample } from "./Docs/Controlled";
import { DeferredDocsExample } from "./Docs/Deferred";
import { GrowingDocsExample } from "./Docs/Growing";
import { OrientationDocsExample } from "./Docs/Orientation";
import { ScrolledDocsExample } from "./Docs/Scrolled";

export const AccordionDocs = () => {
    const [getPolicy, setPolicy] = createSignal<AccordionPolicy>(DEFAULT_ACCORDION_POLICY);
    const [getGap, setGap] = createSignal(AccordionKnobs.STARTING_GAP);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(COLLAPSIBLE_DEFAULTS.transitionDurationMs);
    const [getIsScrolledIntoView, setIsScrolledIntoView] = createSignal(true);
    const [getOrientation, setOrientation] = createSignal<AccordionOrientation>("horizontal");

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"policy"} {...AccordionKnobs.POLICY_TEXT}>
                            <PageSelectField
                                value={getPolicy}
                                values={ACCORDION_POLICIES}
                                ariaLabel={"Policy"}
                                onChange={setPolicy}
                            />
                        </PageProp>

                        <PageProp key={"gap"} {...AccordionKnobs.GAP_TEXT}>
                            <PageNumberField
                                value={getGap}
                                min={AccordionKnobs.MIN_GAP}
                                max={AccordionKnobs.MAX_GAP}
                                step={AccordionKnobs.GAP_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Gap in pixels"}
                                onInput={setGap}
                            />
                        </PageProp>

                        <PageProp key={"transitionDurationMs"} {...AccordionKnobs.TRANSITION_DURATION_MS_TEXT}>
                            <PageNumberField
                                value={getTransitionDurationMs}
                                min={AccordionKnobs.MIN_TRANSITION_MS}
                                max={AccordionKnobs.MAX_TRANSITION_MS}
                                step={AccordionKnobs.TRANSITION_STEP_MS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Transition duration in milliseconds"}
                                onInput={setTransitionDurationMs}
                            />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample
                    isSingleExpand={() => AccordionPageUtils.getIsSingleExpand(getPolicy())}
                    isExpandRequired={() => AccordionPageUtils.getIsExpandRequired(getPolicy())}
                    gap={getGap}
                    transitionDurationMs={getTransitionDurationMs}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.openingClosingOutside} />

            <PageDocsExample path={`${DOCS_ROOT}/Controlled.tsx`}>
                <ControlledDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.panelsFollowContent} />

            <PageDocsExample path={`${DOCS_ROOT}/Growing.tsx`}>
                <GrowingDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.builtFirstOpen} />

            <PageDocsExample path={`${DOCS_ROOT}/Deferred.tsx`}>
                <DeferredDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.scrolledIntoView} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Scrolled.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"isScrolledIntoViewOnExpand"}
                        {...AccordionKnobs.IS_SCROLLED_INTO_VIEW_ON_EXPAND_TEXT}
                    >
                        <PageCheckField
                            value={getIsScrolledIntoView}
                            ariaLabel={"Scroll into view"}
                            onChange={setIsScrolledIntoView}
                        />
                    </PageProp>
                )}
            >
                <ScrolledDocsExample isScrolledIntoViewOnExpand={getIsScrolledIntoView} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.orientation} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Orientation.tsx`}
                renderKnobs={() => (
                    <PageProp key={"orientation"} {...AccordionKnobs.ORIENTATION_TEXT}>
                        <PageSelectField
                            value={getOrientation}
                            values={ACCORDION_ORIENTATIONS}
                            ariaLabel={"Orientation"}
                            onChange={setOrientation}
                        />
                    </PageProp>
                )}
            >
                <OrientationDocsExample orientation={getOrientation} />
            </PageDocsExample>
        </>
    );
};
