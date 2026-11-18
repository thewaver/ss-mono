import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/FormPage/FormPage.const";

import { PageDocsAlert } from "../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { BasicDocsExample } from "./Docs/Basic";
import { SubmittedDocsExample } from "./Docs/Submitted";
import { ValuesDocsExample } from "./Docs/Values";

export const FormDocs = () => (
    <>
        <PageDocsAlert severity={"info"}>
            Form validates nothing. Every message and every error here comes from the example's own code; Form only
            passes on what its fields report.
        </PageDocsAlert>

        <PageDocsSection {...DOCS_SECTIONS.errorsWhileTyping} />

        <PageDocsExample path={`${DOCS_ROOT}/Basic.tsx`}>
            <BasicDocsExample />
        </PageDocsExample>

        <PageDocsSection {...DOCS_SECTIONS.errorsShownOnceForm} />

        <PageDocsExample path={`${DOCS_ROOT}/Submitted.tsx`}>
            <SubmittedDocsExample />
        </PageDocsExample>

        <PageDocsSection {...DOCS_SECTIONS.readingWhatWasSent} />

        <PageDocsExample path={`${DOCS_ROOT}/Values.tsx`}>
            <ValuesDocsExample />
        </PageDocsExample>
    </>
);
