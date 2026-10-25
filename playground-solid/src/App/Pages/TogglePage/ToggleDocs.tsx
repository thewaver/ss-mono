import { createSignal } from "solid-js";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TogglePage/TogglePage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { DecoratedDocsExample } from "./Docs/Decorated";
import { LabeledDocsExample } from "./Docs/Labeled";
import { MixedDocsExample } from "./Docs/Mixed";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const ToggleDocs = () => {
    const [getHasError, setHasError] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getIsReachableWhenDisabled, setIsReachableWhenDisabled] = createSignal(false);
    const [getIsTooltipDisabled, setIsTooltipDisabled] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"hasError"}
                            label={"Error"}
                            hint={"Marks the toggle invalid, for screen readers as well as for the painter."}
                            controls={"Sets ToggleProps.hasError"}
                        >
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            key={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the toggle off: neither a click nor Space changes it, and the Tab key skips it."
                            }
                            controls={"Sets ToggleProps.isDisabled"}
                        >
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection title={"Mixed"}>
                {
                    "A toggle summarizing others can be neither on nor off: set isMixed while they disagree. A switch has no way to say mixed to a screen reader, so while mixed the toggle reads as a mixed checkbox instead, and as a switch again once it is on or off. Pressing it sets a value, so here it turns both of the toggles it controls on or off."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Mixed.tsx`}>
                <MixedDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Decoration"}>
                {
                    "Anything drawn over the toggle goes through renderDecoration, which is handed the toggle's state like the painter is: here a corner highlight shows while it is pressed."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Decorated.tsx`}>
                <DecoratedDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Tooltip"}>
                {
                    "Give a toggle tooltipDefs and it shows a tooltip on hover and on keyboard focus, read by screen readers as the toggle's description. A disabled toggle shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and pressing it still changes nothing."
                }
            </PageDocsSection>

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"tooltipIsReachableWhenDisabled"}
                            label={"Reachable when disabled"}
                            hint={
                                "Keeps a disabled toggle's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled toggle shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets ToggleProps.isReachableWhenDisabled"}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp
                            key={"tooltipIsDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the toggle off: neither a click nor Space changes it, and the Tab key skips it."
                            }
                            controls={"Sets ToggleProps.isDisabled"}
                        >
                            <PageCheckField
                                value={getIsTooltipDisabled}
                                ariaLabel={"Disabled"}
                                onChange={setIsTooltipDisabled}
                            />
                        </PageProp>
                    </>
                )}
            >
                <TooltipDocsExample
                    isDisabled={getIsTooltipDisabled}
                    isReachableWhenDisabled={getIsReachableWhenDisabled}
                />
            </PageDocsExample>

            <PageDocsSection title={"Named by a Label"}>
                {
                    "Inside a Label, the toggle takes its name from the label's text, so it needs no ariaLabel, and pressing the text switches it too."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>
        </>
    );
};
