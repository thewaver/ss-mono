import { createSignal } from "solid-js";

import { MenubarKnobs } from "@thewaver/ss-playground/App/Knobs/Menubars.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { OverflowDocsExample } from "./Docs/Overflow";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const MenubarDocs = () => {
    const [getBarWidth, setBarWidth] = createSignal(MenubarKnobs.STARTING_NARROW_BAR_WIDTH);

    return (
        <>
            <PageDocsExample path={`${DOCS_ROOT}/Basic.tsx`}>
                <BasicDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.wordsThatDoNotFit} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Overflow.tsx`}
                renderKnobs={() => (
                    <PageProp key={"barWidth"} {...MenubarKnobs.BAR_WIDTH_TEXT}>
                        <PageNumberField
                            value={getBarWidth}
                            min={MenubarKnobs.MIN_BAR_WIDTH}
                            max={MenubarKnobs.MAX_BAR_WIDTH}
                            step={MenubarKnobs.BAR_WIDTH_STEP}
                            ariaLabel={"Bar width in pixels"}
                            onInput={setBarWidth}
                        />
                    </PageProp>
                )}
            >
                <OverflowDocsExample barWidth={getBarWidth} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
