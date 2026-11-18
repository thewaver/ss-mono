import { createSignal } from "solid-js";

import { ToggleKnobs } from "@thewaver/ss-playground/App/Knobs/Toggles.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/TogglePage/TogglePage.const";

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
                        <PageProp key={"hasError"} {...ToggleKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...ToggleKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.mixed} />

            <PageDocsExample path={`${DOCS_ROOT}/Mixed.tsx`}>
                <MixedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.decoration} />

            <PageDocsExample path={`${DOCS_ROOT}/Decorated.tsx`}>
                <DecoratedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tooltip} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"tooltipIsReachableWhenDisabled"}
                            {...ToggleKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp key={"tooltipIsDisabled"} {...ToggleKnobs.IS_DISABLED_TEXT}>
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
        </>
    );
};
