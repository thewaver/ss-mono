import { useState } from "react";

import { TOOLBAR_DEFAULTS } from "@thewaver/ss-components-react";
import { ToolbarKnobs } from "@thewaver/ss-playground/App/Knobs/Toolbars.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { PressedDocsExample } from "./Docs/Pressed";
import { RefusingDocsExample } from "./Docs/Refusing";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { RingDocsExample } from "./Docs/Ring";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const ToolbarDocs = () => {
    const [barWidth, setBarWidth] = useState(ToolbarKnobs.STARTING_BAR_WIDTH);
    const [gap, setGap] = useState(TOOLBAR_DEFAULTS.gap);
    const [isTooltipDisabled, setIsTooltipDisabled] = useState(false);
    const [isReachableWhenDisabled, setIsReachableWhenDisabled] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"barWidth"} {...ToolbarKnobs.BAR_WIDTH_TEXT}>
                            <PageNumberField
                                value={barWidth}
                                min={ToolbarKnobs.MIN_BAR_WIDTH}
                                max={ToolbarKnobs.MAX_BAR_WIDTH}
                                step={ToolbarKnobs.BAR_WIDTH_STEP}
                                ariaLabel={"Bar width in pixels"}
                                onInput={setBarWidth}
                            />
                        </PageProp>

                        <PageProp itemKey={"gap"} {...ToolbarKnobs.GAP_TEXT}>
                            <PageNumberField
                                value={gap}
                                min={ToolbarKnobs.MIN_GAP}
                                max={ToolbarKnobs.MAX_GAP}
                                step={ToolbarKnobs.GAP_STEP}
                                ariaLabel={"Gap in pixels"}
                                onInput={setGap}
                            />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample barWidth={barWidth} gap={gap} onBarWidthChange={setBarWidth} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.actionsThatRefuseCollapse} />

            <PageDocsExample path={`${DOCS_ROOT}/Refusing.tsx`}>
                <RefusingDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.actionsThatStayPressed} />

            <PageDocsExample path={`${DOCS_ROOT}/Pressed.tsx`}>
                <PressedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tooltips} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            {...ToolbarKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp itemKey={"tooltipIsDisabled"} {...ToolbarKnobs.TOOLTIP_IS_DISABLED_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.ringTools} />

            <PageDocsExample path={`${DOCS_ROOT}/Ring.tsx`}>
                <RingDocsExample />
            </PageDocsExample>
        </>
    );
};
