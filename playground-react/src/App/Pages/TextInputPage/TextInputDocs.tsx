import { useState } from "react";

import { TextInputKnobs } from "@thewaver/ss-playground/App/Knobs/TextInputs.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { AdornmentsDocsExample } from "./Docs/Adornments";
import { BasicDocsExample } from "./Docs/Basic";
import { EditableDocsExample } from "./Docs/Editable";
import { LabeledDocsExample } from "./Docs/Labeled";
import { NumberDocsExample } from "./Docs/Number";
import { PasswordDocsExample } from "./Docs/Password";
import { RefusingDocsExample } from "./Docs/Refusing";
import { RewritingDocsExample } from "./Docs/Rewriting";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { SuggestionsDocsExample } from "./Docs/Suggestions";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const TextInputDocs = () => {
    const [isReadOnly, setIsReadOnly] = useState(false);
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
                        <PageProp itemKey={"isReadOnly"} {...TextInputKnobs.IS_READ_ONLY_TEXT}>
                            <PageCheckField value={isReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp itemKey={"hasError"} {...TextInputKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...TextInputKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={isReadOnly} hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rewritingWhatTyped} />

            <PageDocsExample path={`${DOCS_ROOT}/Rewriting.tsx`}>
                <RewritingDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.refusingWhatTyped} />

            <PageDocsExample path={`${DOCS_ROOT}/Refusing.tsx`}>
                <RefusingDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.leadingTrailingContent} />

            <PageDocsExample path={`${DOCS_ROOT}/Adornments.tsx`}>
                <AdornmentsDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.passwords} />

            <PageDocsExample path={`${DOCS_ROOT}/Password.tsx`}>
                <PasswordDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.numbers} />

            <PageDocsExample path={`${DOCS_ROOT}/Number.tsx`}>
                <NumberDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.suggestions} />

            <PageDocsExample path={`${DOCS_ROOT}/Suggestions.tsx`}>
                <SuggestionsDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tooltip} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            {...TextInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp itemKey={"tooltipIsDisabled"} {...TextInputKnobs.IS_DISABLED_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.namedLabel} />

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.editingPlace} />

            <PageDocsExample path={`${DOCS_ROOT}/Editable.tsx`}>
                <EditableDocsExample />
            </PageDocsExample>
        </>
    );
};
