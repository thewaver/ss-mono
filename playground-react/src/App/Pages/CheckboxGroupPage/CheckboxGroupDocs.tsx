import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { BasicDocsExample } from "./Docs/Basic";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { SelectAllDocsExample } from "./Docs/SelectAll";

export const CheckboxGroupDocs = () => (
    <>
        <PageDocsExample path={`${DOCS_ROOT}/Basic.tsx`}>
            <BasicDocsExample />
        </PageDocsExample>

        <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

        <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
            <RightToLeftDocsExample />
        </PageDocsExample>

        <PageDocsSection {...DOCS_SECTIONS.selectAllBox} />

        <PageDocsExample path={`${DOCS_ROOT}/SelectAll.tsx`}>
            <SelectAllDocsExample />
        </PageDocsExample>
    </>
);
