import { useState } from "react";

import { MultiSelectKnobs } from "@thewaver/ss-playground/App/Knobs/MultiSelects.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/MultiSelectPage/MultiSelectPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { ClearableDocsExample } from "./Docs/Clearable";
import { GroupedDocsExample } from "./Docs/Grouped";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const MultiSelectDocs = () => {
    const [hasError, setHasError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"hasError"} {...MultiSelectKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...MultiSelectKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.groupsQuery} />

            <PageDocsExample path={`${DOCS_ROOT}/Grouped.tsx`}>
                <GroupedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.clearingEveryPick} />

            <PageDocsExample path={`${DOCS_ROOT}/Clearable.tsx`}>
                <ClearableDocsExample />
            </PageDocsExample>
        </>
    );
};
