import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/FormSectionPage/FormSectionPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { NestedDocsExample } from "./Docs/Nested";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { SectionsDocsExample } from "./Docs/Sections";

export const FormSectionDocs = () => (
    <>
        <PageDocsSection {...DOCS_SECTIONS.groupRule} />

        <PageDocsExample path={`${DOCS_ROOT}/Sections.tsx`}>
            <SectionsDocsExample />
        </PageDocsExample>

        <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

        <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
            <RightToLeftDocsExample />
        </PageDocsExample>

        <PageDocsSection {...DOCS_SECTIONS.sectionInsideSection} />

        <PageDocsExample path={`${DOCS_ROOT}/Nested.tsx`}>
            <NestedDocsExample />
        </PageDocsExample>
    </>
);
