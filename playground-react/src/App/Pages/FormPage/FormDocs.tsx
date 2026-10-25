import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/FormPage/FormPage.const";

import { PageDocsAlert } from "../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { BasicDocsExample } from "./Docs/Basic";
import { SubmittedDocsExample } from "./Docs/Submitted";

export const FormDocs = () => (
    <>
        <PageDocsAlert severity={"info"}>
            Form validates nothing. Every message and every error here comes from the example's own code; Form only
            passes on what its fields report.
        </PageDocsAlert>

        <PageDocsSection
            title={"Errors shown as you type"}
            content={
                "Each field works out its own error from what is in it, so the password's rule shows from the start and the email complains as soon as what is typed has no @. The content's [prop]isValid[/prop] is true while no field reports an error, and drives the line under the buttons. The submit handler runs either way, since whether to send is yours to decide; once it returns, focus moves to the first field reporting an error, in the order the fields were drawn."
            }
        />

        <PageDocsExample path={`${DOCS_ROOT}/Basic.tsx`}>
            <BasicDocsExample />
        </PageDocsExample>

        <PageDocsSection
            title={"Errors shown once the form is sent"}
            content={
                "The content's [prop]hasSubmitted[/prop] turns true on the first submit, so an error such as a field left empty can wait until then rather than greet the reader: this form looks clean until Subscribe is pressed, and then shows every error at once."
            }
        />

        <PageDocsExample path={`${DOCS_ROOT}/Submitted.tsx`}>
            <SubmittedDocsExample />
        </PageDocsExample>
    </>
);
