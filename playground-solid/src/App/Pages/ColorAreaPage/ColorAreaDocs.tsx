import { createSignal } from "solid-js";

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
    const [getIsDisabled, setIsDisabled] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp key={"isDisabled"} {...ColorAreaKnobs.IS_DISABLED_TEXT}>
                        <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                    </PageProp>
                )}
            >
                <BasicDocsExample isDisabled={getIsDisabled} />
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
