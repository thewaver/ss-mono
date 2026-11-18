import { createSignal } from "solid-js";

import { PreviewKnobs } from "@thewaver/ss-playground/App/Knobs/Previews.const";
import {
    COLLAPSED_HEIGHT,
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { ControlledDocsExample } from "./Docs/Controlled";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { ScrolledDocsExample } from "./Docs/Scrolled";
import { ShortDocsExample } from "./Docs/Short";

export const PreviewDocs = () => {
    const [getCollapsedHeight, setCollapsedHeight] = createSignal(COLLAPSED_HEIGHT);
    const [getIsScrolledIntoViewOnCollapse, setIsScrolledIntoViewOnCollapse] = createSignal(true);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp key={"collapsedHeight"} {...PreviewKnobs.COLLAPSED_HEIGHT_TEXT}>
                        <PageNumberField
                            value={getCollapsedHeight}
                            min={PreviewKnobs.MIN_COLLAPSED_HEIGHT}
                            max={PreviewKnobs.MAX_COLLAPSED_HEIGHT}
                            step={PreviewKnobs.COLLAPSED_HEIGHT_STEP}
                            ariaLabel={"Collapsed height in pixels"}
                            onInput={setCollapsedHeight}
                        />
                    </PageProp>
                )}
            >
                <BasicDocsExample collapsedHeight={getCollapsedHeight} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.whenEverythingFits} />

            <PageDocsExample path={`${DOCS_ROOT}/Short.tsx`}>
                <ShortDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.openingClosingOutside} />

            <PageDocsExample path={`${DOCS_ROOT}/Controlled.tsx`}>
                <ControlledDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.insideBoxThatScrolls} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Scrolled.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"isScrolledIntoViewOnCollapse"}
                        {...PreviewKnobs.IS_SCROLLED_INTO_VIEW_ON_COLLAPSE_TEXT}
                    >
                        <PageCheckField
                            value={getIsScrolledIntoViewOnCollapse}
                            ariaLabel={"Scroll into view on collapse"}
                            onChange={setIsScrolledIntoViewOnCollapse}
                        />
                    </PageProp>
                )}
            >
                <ScrolledDocsExample isScrolledIntoViewOnCollapse={getIsScrolledIntoViewOnCollapse} />
            </PageDocsExample>
        </>
    );
};
