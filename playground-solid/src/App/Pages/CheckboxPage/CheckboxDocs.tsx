import { createSignal } from "solid-js";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/CheckboxPage/CheckboxPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { DecoratedDocsExample } from "./Docs/Decorated";
import { LabeledDocsExample } from "./Docs/Labeled";
import { MixedDocsExample } from "./Docs/Mixed";
import { RefusingDocsExample } from "./Docs/Refusing";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const CheckboxDocs = () => {
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
                            hint={"Marks the checkbox invalid, for screen readers as well as for the painter."}
                            controls={"Sets CheckboxProps.hasError"}
                        >
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            key={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the checkbox off: neither a click nor Space changes it, and the Tab key skips it."
                            }
                            controls={"Sets CheckboxProps.isDisabled"}
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
                    "A checkbox can be neither on nor off. Set isMixed and it reads as mixed, to a screen reader as well as on screen, which is what a box summarizing others shows while they disagree. Pressing it sets a value, so here it turns both of the boxes it controls on or off."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Mixed.tsx`}>
                <MixedDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Refusing a change"}>
                {
                    "The checkbox reports a press through onChange and shows whatever its value then holds, so a change can be refused by writing the old value back. Here at least one way to be reached must stay on: whichever box is the last one on refuses to go off."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Refusing.tsx`}>
                <RefusingDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Decoration"}>
                {
                    "Anything drawn over the box goes through renderDecoration, which is handed the checkbox's state like the painter is: here a corner highlight shows while it is pressed."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Decorated.tsx`}>
                <DecoratedDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Tooltip"}>
                {
                    "Give a checkbox tooltipDefs and it shows a tooltip on hover and on keyboard focus, read by screen readers as the checkbox's description. A disabled checkbox shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and pressing it still changes nothing."
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
                                "Keeps a disabled checkbox's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled checkbox shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets CheckboxProps.isReachableWhenDisabled"}
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
                                "Turns the checkbox off: neither a click nor Space changes it, and the Tab key skips it."
                            }
                            controls={"Sets CheckboxProps.isDisabled"}
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
                    "Inside a Label, the checkbox takes its name from the label's text, so it needs no ariaLabel, and pressing the text checks it too."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>
        </>
    );
};
