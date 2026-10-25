import { createSignal } from "solid-js";

import { PreviewKnobs } from "@thewaver/ss-playground/App/Knobs/Previews.const";
import { COLLAPSED_HEIGHT, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";

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
                    <PageProp
                        key={"collapsedHeight"}
                        label={"Collapsed height (px)"}
                        hint={"How much of the content shows while the preview is closed."}
                        controls={"Sets PreviewProps.collapsedHeight"}
                    >
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

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the content and the button that opens it sit against the right edge."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"When everything fits"}
                content={
                    "Content no taller than [prop]collapsedHeight[/prop] is shown whole, with no button and no fade, since there is nothing behind them."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Short.tsx`}>
                <ShortDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Opening and closing from outside"}
                content={
                    "The preview keeps track of whether it is open by itself. To open or close it from elsewhere on the page, hold the boolean and pass it in as [prop]expanded[/prop]: both sides write it, so pressing Read more updates yours and writing yours opens or closes the preview."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Controlled.tsx`}>
                <ControlledDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Inside a box that scrolls"}
                content={
                    "Closing a long preview takes its height out from under the reader, and everything below it jumps up, the button with it. Set [prop]isScrolledIntoViewOnCollapse[/prop] and closing scrolls the preview back into view, so the reader is left where they started."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Scrolled.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"isScrolledIntoViewOnCollapse"}
                        label={"Scroll into view on collapse"}
                        hint={"Whether closing the preview scrolls it back into view."}
                        controls={"Sets PreviewProps.isScrolledIntoViewOnCollapse"}
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
