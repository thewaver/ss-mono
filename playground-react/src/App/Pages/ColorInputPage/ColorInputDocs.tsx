import { useState } from "react";

import { ColorInputKnobs } from "@thewaver/ss-playground/App/Knobs/ColorInputs.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/ColorInputPage/ColorInputPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { LabeledDocsExample } from "./Docs/Labeled";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { SnappingDocsExample } from "./Docs/Snapping";
import { SwatchDocsExample } from "./Docs/Swatch";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const ColorInputDocs = () => {
    const [hasError, setHasError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isReachableWhenDisabled, setIsReachableWhenDisabled] = useState(false);
    const [isTooltipDisabled, setIsTooltipDisabled] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"hasError"} {...ColorInputKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...ColorInputKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"A swatch alone"}
                content={
                    "The field draws nothing of its own: [prop]renderContent[/prop] is handed the color and paints it however it likes, here as a swatch with no text beside it. The readout shows the value the swatch stands for. The field's name says what the color is for, so the color itself reaches a screen reader as the field's description, from [prop]computeValueText[/prop]: here its red, green and blue spelled out. Left out, the value is read as written, and no painter has to draw any text for it ([wcag id=\"4.1.2\"]WCAG 4.1.2[/wcag])."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Swatch.tsx`}>
                <SwatchDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.correctingPick} />

            <PageDocsExample path={`${DOCS_ROOT}/Snapping.tsx`}>
                <SnappingDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tooltip} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            {...ColorInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp itemKey={"tooltipIsDisabled"} {...ColorInputKnobs.IS_DISABLED_TEXT}>
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
