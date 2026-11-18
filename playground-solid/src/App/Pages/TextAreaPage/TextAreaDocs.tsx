import { createSignal } from "solid-js";

import { TextAreaKnobs } from "@thewaver/ss-playground/App/Knobs/TextAreas.const";
import { DOCS_ROOT, DOCS_SECTIONS, MAX_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { GrowingDocsExample } from "./Docs/Growing";
import { LabeledDocsExample } from "./Docs/Labeled";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const TextAreaDocs = () => {
    const [getIsReadOnly, setIsReadOnly] = createSignal(false);
    const [getHasError, setHasError] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getMaxRows, setMaxRows] = createSignal(MAX_ROWS);
    const [getIsReachableWhenDisabled, setIsReachableWhenDisabled] = createSignal(false);
    const [getIsTooltipDisabled, setIsTooltipDisabled] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"isReadOnly"} {...TextAreaKnobs.IS_READ_ONLY_TEXT}>
                            <PageCheckField value={getIsReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp key={"hasError"} {...TextAreaKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...TextAreaKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={getIsReadOnly} hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.growingWithTyping} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Growing.tsx`}
                renderKnobs={() => (
                    <PageProp key={"maxRows"} {...TextAreaKnobs.MAX_ROWS_TEXT}>
                        <PageNumberField
                            value={getMaxRows}
                            min={TextAreaKnobs.MIN_MAX_ROWS}
                            max={TextAreaKnobs.MAX_MAX_ROWS}
                            step={TextAreaKnobs.MAX_ROWS_STEP}
                            ariaLabel={"Max rows"}
                            onInput={setMaxRows}
                        />
                    </PageProp>
                )}
            >
                <GrowingDocsExample maxRows={getMaxRows} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tooltip} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"tooltipIsReachableWhenDisabled"}
                            {...TextAreaKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp key={"tooltipIsDisabled"} {...TextAreaKnobs.IS_DISABLED_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.namedLabel} />

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>
        </>
    );
};
