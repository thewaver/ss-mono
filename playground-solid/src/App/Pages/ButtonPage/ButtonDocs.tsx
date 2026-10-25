import { createSignal } from "solid-js";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { DecoratedDocsExample } from "./Docs/Decorated";
import { RepeatingDocsExample } from "./Docs/Repeating";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const ButtonDocs = () => {
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getHasError, setHasError] = createSignal(false);
    const [getIsPressed, setIsPressed] = createSignal(false);
    const [getIsTooltipDisabled, setIsTooltipDisabled] = createSignal(false);
    const [getIsReachableWhenDisabled, setIsReachableWhenDisabled] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"hasError"}
                            label={"Error"}
                            hint={
                                "Puts the button in its error look. It changes nothing about what the button accepts or does."
                            }
                            controls={"Sets Button.hasError"}
                        >
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            key={"isPressed"}
                            label={"Pressed"}
                            hint={
                                "Marks the button as holding a state, like a toggle that stays down. What that looks like is up to the painter; here it gets a 4px inner ring in the secondary color."
                            }
                            controls={"Sets Button.isPressed"}
                        >
                            <PageCheckField value={getIsPressed} ariaLabel={"Pressed"} onChange={setIsPressed} />
                        </PageProp>

                        <PageProp
                            key={"isDisabled"}
                            label={"Disabled"}
                            hint={"Turns the button off: it ignores presses and hover, and the Tab key skips it."}
                            controls={"Sets Button.isDisabled"}
                        >
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isDisabled={getIsDisabled} hasError={getHasError} isPressed={getIsPressed} />
            </PageDocsExample>

            <PageDocsSection
                title={"Tooltip"}
                content={
                    "Give a button [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, and links it to the button so screen readers read it as the button's description. A disabled button shows no tooltip unless you also keep it reachable when disabled; then it can still tell people why it is off."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"tooltipIsReachableWhenDisabled"}
                            label={"Reachable when disabled"}
                            hint={
                                "Keeps a disabled button's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled button shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets Button.isReachableWhenDisabled"}
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
                            hint={"Turns the button off: it ignores presses and hover, and the Tab key skips it."}
                            controls={"Sets Button.isDisabled"}
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

            <PageDocsSection
                title={"Decoration"}
                content={
                    "Anything drawn over the button goes through [prop]renderDecoration[/prop], which is handed the button's state like the painter is. Here a corner highlight shows while the button is pressed, and a ripple spreads from where it was pressed, which [prop]onActivation[/prop] reports."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Decorated.tsx`}>
                <DecoratedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Hold to repeat"}
                content={
                    "A button reports the pointer going down and up through [prop]onPointerDown[/prop] and [prop]onPointerUp[/prop], which is enough to repeat an action while it is held: here a step happens at once, then again and again after a short wait until the pointer lifts or leaves. A press from the keyboard still steps once, through [prop]onClick[/prop]."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Repeating.tsx`}>
                <RepeatingDocsExample />
            </PageDocsExample>
        </>
    );
};
