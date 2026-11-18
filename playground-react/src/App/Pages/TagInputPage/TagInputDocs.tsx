import { useState } from "react";

import { TagInputKnobs } from "@thewaver/ss-playground/App/Knobs/TagInputs.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { CrowdedDocsExample } from "./Docs/Crowded";
import { EmptyDocsExample } from "./Docs/Empty";
import { LabeledDocsExample } from "./Docs/Labeled";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { TooltipDocsExample } from "./Docs/Tooltip";
import { UniqueDocsExample } from "./Docs/Unique";

export const TagInputDocs = () => {
    const [hasError, setHasError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isReachableWhenDisabled, setIsReachableWhenDisabled] = useState(false);
    const [isTooltipDisabled, setIsTooltipDisabled] = useState(false);

    return (
        <>
            <PageDocsSection
                title={"Naming each tag"}
                content={
                    'A tag is a button, and pressing it removes it. Its visible word alone does not say that, so a screen reader would hear only "solid, button" and not what the button is for ([wcag id="2.4.6"]WCAG 2.4.6[/wcag]). Every example here names its tags through [prop]computeTagAriaLabel[/prop], which is handed the tag and answers in the page\'s language: here "solid, remove". The tag\'s own word comes first, so someone speaking to their computer can still say what they see ([wcag id="2.5.3"]WCAG 2.5.3[/wcag]).'
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"hasError"} {...TagInputKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...TagInputKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.placeholder} />

            <PageDocsExample path={`${DOCS_ROOT}/Empty.tsx`}>
                <EmptyDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.refusingWord} />

            <PageDocsExample path={`${DOCS_ROOT}/Unique.tsx`}>
                <UniqueDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.manyTagsNarrowBox} />

            <PageDocsExample path={`${DOCS_ROOT}/Crowded.tsx`}>
                <CrowdedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tooltip} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            {...TagInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp itemKey={"tooltipIsDisabled"} {...TagInputKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField
                                value={isTooltipDisabled}
                                ariaLabel={"Disabled"}
                                onChange={setIsTooltipDisabled}
                            />
                        </PageProp>
                    </>
                )}
            >
                <TooltipDocsExample isDisabled={isTooltipDisabled} isReachableWhenDisabled={isReachableWhenDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.namedLabel} />

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>
        </>
    );
};
