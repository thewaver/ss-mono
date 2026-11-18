import { createSignal } from "solid-js";

import { ButtonKnobs } from "@thewaver/ss-playground/App/Knobs/Buttons.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.const";

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
                        <PageProp key={"hasError"} {...ButtonKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp key={"isPressed"} {...ButtonKnobs.IS_PRESSED_TEXT}>
                            <PageCheckField value={getIsPressed} ariaLabel={"Pressed"} onChange={setIsPressed} />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...ButtonKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isDisabled={getIsDisabled} hasError={getHasError} isPressed={getIsPressed} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tooltip} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"tooltipIsReachableWhenDisabled"}
                            {...ButtonKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp key={"tooltipIsDisabled"} {...ButtonKnobs.IS_DISABLED_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.decoration} />

            <PageDocsExample path={`${DOCS_ROOT}/Decorated.tsx`}>
                <DecoratedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.holdRepeat} />

            <PageDocsExample path={`${DOCS_ROOT}/Repeating.tsx`}>
                <RepeatingDocsExample />
            </PageDocsExample>
        </>
    );
};
