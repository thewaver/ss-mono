import { createSignal } from "solid-js";

import { TABLE_OF_CONTENTS_DEFAULTS } from "@thewaver/ss-components-solid";
import { TableOfContentsKnobs } from "@thewaver/ss-playground/App/Knobs/TablesOfContents.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const TableOfContentsDocs = () => {
    const [getOffsetRatio, setOffsetRatio] = createSignal(TABLE_OF_CONTENTS_DEFAULTS.offsetRatio);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp key={"offsetRatio"} {...TableOfContentsKnobs.OFFSET_RATIO_TEXT}>
                        <PageNumberField
                            value={getOffsetRatio}
                            min={TableOfContentsKnobs.MIN_OFFSET_RATIO}
                            max={TableOfContentsKnobs.MAX_OFFSET_RATIO}
                            step={TableOfContentsKnobs.OFFSET_RATIO_STEP}
                            ariaLabel={"Offset ratio"}
                            onInput={setOffsetRatio}
                        />
                    </PageProp>
                )}
            >
                <BasicDocsExample offsetRatio={getOffsetRatio} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
