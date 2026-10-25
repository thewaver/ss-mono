import { createSignal } from "solid-js";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/MultiSelectPage/MultiSelectPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { ClearableDocsExample } from "./Docs/Clearable";
import { GroupedDocsExample } from "./Docs/Grouped";

export const MultiSelectDocs = () => {
    const [getHasError, setHasError] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"hasError"}
                            label={"Error"}
                            hint={"Marks the field invalid, for screen readers as well as for the painter."}
                            controls={"Sets MultiSelectProps.hasError"}
                        >
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            key={"isDisabled"}
                            label={"Disabled"}
                            hint={"Turns the field off: it does not open, and the Tab key skips it."}
                            controls={"Sets MultiSelectProps.isDisabled"}
                        >
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection title={"Groups and a query"}>
                {
                    "Options can sit in groups, and a query turns the field into a text box that narrows them, as on Select. What counts as a match is yours to decide; here a group the query has emptied is dropped from the list."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Grouped.tsx`}>
                <GroupedDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Clearing every pick"}>
                {
                    "Give it renderClear and a clear button sits at the end of the field while anything is picked; pressing it empties every pick at once and reports the change like any other. It needs clearAriaLabel to name it."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Clearable.tsx`}>
                <ClearableDocsExample />
            </PageDocsExample>
        </>
    );
};
