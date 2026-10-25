import { useState } from "react";

import { TABLE_OF_CONTENTS_DEFAULTS } from "@thewaver/ss-components-react";
import { TableOfContentsKnobs } from "@thewaver/ss-playground/App/Knobs/TablesOfContents.const";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const TableOfContentsDocs = () => {
    const [offsetRatio, setOffsetRatio] = useState(TABLE_OF_CONTENTS_DEFAULTS.offsetRatio);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"offsetRatio"}
                        label={"Offset ratio"}
                        hint={
                            "How far down the box the line sits that decides which section is current, as a share of its height. A section becomes current once its heading has scrolled above the line."
                        }
                        controls={"Sets TableOfContentsProps.offsetRatio"}
                    >
                        <PageNumberField
                            value={offsetRatio}
                            min={TableOfContentsKnobs.MIN_OFFSET_RATIO}
                            max={TableOfContentsKnobs.MAX_OFFSET_RATIO}
                            step={TableOfContentsKnobs.OFFSET_RATIO_STEP}
                            ariaLabel={"Offset ratio"}
                            onInput={setOffsetRatio}
                        />
                    </PageProp>
                )}
            >
                <BasicDocsExample offsetRatio={offsetRatio} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the outline sits on the right of the article, and the painter's marker and indentation move to the right edge of each link, since it draws them on the side the text starts from."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
