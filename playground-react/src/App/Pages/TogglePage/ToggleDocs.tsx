import { useState } from "react";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TogglePage/TogglePage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { DecoratedDocsExample } from "./Docs/Decorated";
import { MixedDocsExample } from "./Docs/Mixed";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const ToggleDocs = () => {
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
                        <PageProp
                            itemKey={"hasError"}
                            label={"Error"}
                            hint={"Marks the toggle invalid, for screen readers as well as for the painter."}
                            controls={"Sets ToggleProps.hasError"}
                        >
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the toggle off: neither a click nor Space changes it, and the Tab key skips it."
                            }
                            controls={"Sets ToggleProps.isDisabled"}
                        >
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the track sits to the right of its words, and switching the toggle on slides the handle to the left, the end the text runs toward."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Mixed"}
                content={
                    "A toggle summarizing others can be neither on nor off: set [prop]isMixed[/prop] while they disagree. A switch has no way to say mixed to a screen reader, so while mixed the toggle reads as a mixed checkbox instead, and as a switch again once it is on or off. Pressing it sets a value, so here it turns both of the toggles it controls on or off."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Mixed.tsx`}>
                <MixedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Decoration"}
                content={
                    "Anything drawn over the toggle goes through [prop]renderDecoration[/prop], which is handed the toggle's state like the painter is: here a corner highlight shows while it is pressed."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Decorated.tsx`}>
                <DecoratedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Tooltip"}
                content={
                    "Give a toggle [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the toggle's description. A disabled toggle shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and pressing it still changes nothing."
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
                                "Keeps a disabled toggle's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled toggle shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets ToggleProps.isReachableWhenDisabled"}
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
                            hint={
                                "Turns the toggle off: neither a click nor Space changes it, and the Tab key skips it."
                            }
                            controls={"Sets ToggleProps.isDisabled"}
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
        </>
    );
};
