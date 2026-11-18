import { useState } from "react";

import { ColorAreaKnobs } from "@thewaver/ss-playground/App/Knobs/ColorAreas.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { PickerDocsExample } from "./Docs/Picker";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const ColorAreaDocs = () => {
    const [isDisabled, setIsDisabled] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"isDisabled"} {...ColorAreaKnobs.IS_DISABLED_TEXT}>
                        <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                    </PageProp>
                )}
            >
                <BasicDocsExample isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.pickerBuiltAround} />

            <PageDocsExample path={`${DOCS_ROOT}/Picker.tsx`}>
                <PickerDocsExample />
            </PageDocsExample>
        </>
    );
};
