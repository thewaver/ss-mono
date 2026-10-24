import { useState } from "react";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const ButtonDocs = () => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [isTooltipDisabled, setIsTooltipDisabled] = useState(false);
    const [isReachableWhenDisabled, setIsReachableWhenDisabled] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"hasError"}
                            label={"Error"}
                            hint={
                                "Puts the button in its error look. It changes nothing about what the button accepts or does."
                            }
                            controls={"Sets Button.hasError"}
                        >
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            itemKey={"isPressed"}
                            label={"Pressed"}
                            hint={
                                "Marks the button as holding a state, like a toggle that stays down. What that looks like is up to the painter; here it gets a 4px inner ring in the secondary color."
                            }
                            controls={"Sets Button.isPressed"}
                        >
                            <PageCheckField value={isPressed} ariaLabel={"Pressed"} onChange={setIsPressed} />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={"Turns the button off: it ignores presses and hover, and the Tab key skips it."}
                            controls={"Sets Button.isDisabled"}
                        >
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isDisabled={isDisabled} hasError={hasError} isPressed={isPressed} />
            </PageDocsExample>

            <PageDocsSection title={"Tooltip"}>
                {
                    "Give a button tooltipDefs and it shows a tooltip on hover and on keyboard focus, and links it to the button so screen readers read it as the button's description. A disabled button shows no tooltip unless you also keep it reachable when disabled; then it can still tell people why it is off."
                }
            </PageDocsSection>

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            label={"Reachable when disabled"}
                            hint={
                                "Keeps a disabled button's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled button shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets Button.isReachableWhenDisabled"}
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
                            hint={"Turns the button off: it ignores presses and hover, and the Tab key skips it."}
                            controls={"Sets Button.isDisabled"}
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
