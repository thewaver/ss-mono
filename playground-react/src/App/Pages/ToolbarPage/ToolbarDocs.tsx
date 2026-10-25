import { useState } from "react";

import { TOOLBAR_DEFAULTS } from "@thewaver/ss-components-react";
import { ToolbarKnobs } from "@thewaver/ss-playground/App/Knobs/Toolbars.const";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";

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
                        <PageProp
                            itemKey={"barWidth"}
                            label={"Bar width (px)"}
                            hint={
                                "How wide the bar is, also set by dragging its corner. Narrow it far enough and actions start moving into the menu at its end."
                            }
                            controls={"Sets the width of the box the toolbar fills"}
                        >
                            <PageNumberField
                                value={barWidth}
                                min={ToolbarKnobs.MIN_BAR_WIDTH}
                                max={ToolbarKnobs.MAX_BAR_WIDTH}
                                step={ToolbarKnobs.BAR_WIDTH_STEP}
                                ariaLabel={"Bar width in pixels"}
                                onInput={setBarWidth}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"gap"}
                            label={"Gap (px)"}
                            hint={"The space left between actions on the bar."}
                            controls={"Sets ToolbarProps.gap"}
                        >
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

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the actions run from the right and the left arrow moves on to the next action. Narrow the bar and the menu button sits at its left end."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Actions that refuse to collapse"}
                content={
                    "Each action can say how it takes to a narrow bar through [prop]collapse[/prop]. Set to never, it stays in the row whatever that costs the others, so Share is the last one standing; set to always, it lives in the menu however much room there is, as Print does. A disabled action, Rename here, is skipped by the arrow keys and is still listed in the menu, disabled."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Refusing.tsx`}>
                <RefusingDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Actions that stay pressed"}
                content={
                    "Pass [prop]pressedValues[/prop] and every action becomes a toggle that stays down until it is pressed again, with the list holding the values of those that are down. An action that collapses becomes a checkbox in the menu, checked from the same list, so narrowing the bar loses nothing."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Pressed.tsx`}>
                <PressedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Tooltips"}
                content={
                    "Give an action [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, and the same tooltip goes with it into the menu. Inside a SharedTooltip the row shares one tooltip, which moves from action to action instead of closing and opening again. A disabled action shows no tooltip unless [prop]isReachableWhenDisabled[/prop] keeps it in the arrow-key walk; then it can still say why it is off."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            label={"Reachable when disabled"}
                            hint={
                                "Keeps Clear in the arrow-key walk while it is disabled, so focusing or hovering it shows its tooltip. It only matters while Disabled is on."
                            }
                            controls={"Sets ToolbarAction.isReachableWhenDisabled"}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"tooltipIsDisabled"}
                            label={"Disabled"}
                            hint={"Turns Clear off: pressing it does nothing and the arrow keys skip it."}
                            controls={"Sets ToolbarAction.isDisabled"}
                        >
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

            <PageDocsSection
                title={"A ring of tools"}
                content={
                    "Hand [prop]computeLayout[/prop] a layout and the actions are placed by it rather than laid in a row, here round a ring. The layout sizes the bar itself, so nothing runs out of room and there is no menu button, and the arrow keys still walk the actions in the order they are written."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Ring.tsx`}>
                <RingDocsExample />
            </PageDocsExample>
        </>
    );
};
