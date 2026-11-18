import { createSignal } from "solid-js";

import type { SplitPaneOrientation } from "@thewaver/ss-components-solid";
import { SPLIT_PANE_DEFAULTS, SPLIT_PANE_ORIENTATIONS } from "@thewaver/ss-components-solid";
import { SplitPaneKnobs } from "@thewaver/ss-playground/App/Knobs/SplitPanes.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    GUTTER_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import { PageDocsAlert } from "../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { BoundedDocsExample } from "./Docs/Bounded";
import { CompareDocsExample } from "./Docs/Compare";
import { CrampedDocsExample } from "./Docs/Cramped";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { TripleDocsExample } from "./Docs/Triple";

export const SplitPaneDocs = () => {
    const [getOrientation, setOrientation] = createSignal<SplitPaneOrientation>(SPLIT_PANE_DEFAULTS.orientation);
    const [getGutterSize, setGutterSize] = createSignal(SPLIT_PANE_DEFAULTS.gutterSize);
    const [getIsDisabled, setIsDisabled] = createSignal(SplitPaneKnobs.STARTING_IS_DISABLED);

    return (
        <>
            <PageDocsAlert severity={"alert"}>
                Each divider can be dragged, pressed to step it towards the side pressed, so dragging is never the only
                way (<a href={WCAG_URLS["2.5.7"]}>WCAG 2.5.7</a>), or focused and moved with the arrow keys, with Home
                and End for the ends and Enter to fold the pane before it away and bring it back. What it cannot do is
                name itself: give every pane but the last a <span class={docsStyles.docsPropName}>gutterAriaLabel</span>{" "}
                saying what its divider resizes, or a screen reader hears a separator with no name (
                <a href={WCAG_URLS["4.1.2"]}>WCAG 4.1.2</a>). A missing one is warned about in the console.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"orientation"} {...SplitPaneKnobs.ORIENTATION_TEXT}>
                            <PageSelectField
                                value={getOrientation}
                                values={SPLIT_PANE_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={(orientation) => setOrientation(() => orientation)}
                            />
                        </PageProp>

                        <PageProp key={"gutterSize"} {...SplitPaneKnobs.GUTTER_SIZE_TEXT}>
                            <PageNumberField
                                value={getGutterSize}
                                min={SplitPaneKnobs.MIN_GUTTER}
                                max={SplitPaneKnobs.MAX_GUTTER}
                                step={SplitPaneKnobs.GUTTER_STEP}
                                width={GUTTER_FIELD_WIDTH}
                                ariaLabel={"Gutter size in pixels"}
                                onInput={setGutterSize}
                            />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...SplitPaneKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample orientation={getOrientation} gutterSize={getGutterSize} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.boundedPanes} />

            <PageDocsExample path={`${DOCS_ROOT}/Bounded.tsx`}>
                <BoundedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.threePanes} />

            <PageDocsExample path={`${DOCS_ROOT}/Triple.tsx`}>
                <TripleDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.twoPictures} />

            <PageDocsExample path={`${DOCS_ROOT}/Compare.tsx`}>
                <CompareDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.minimumsThatDoNotFit} />

            <PageDocsExample path={`${DOCS_ROOT}/Cramped.tsx`}>
                <CrampedDocsExample />
            </PageDocsExample>
        </>
    );
};
