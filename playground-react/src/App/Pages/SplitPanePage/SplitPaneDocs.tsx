import { useState } from "react";

import type { SplitPaneOrientation } from "@thewaver/ss-components-react";
import { SPLIT_PANE_DEFAULTS, SPLIT_PANE_ORIENTATIONS } from "@thewaver/ss-components-react";
import { SplitPaneKnobs } from "@thewaver/ss-playground/App/Knobs/SplitPanes.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { DOCS_ROOT, GUTTER_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

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
    const [orientation, setOrientation] = useState<SplitPaneOrientation>(SPLIT_PANE_DEFAULTS.orientation);
    const [gutterSize, setGutterSize] = useState(SPLIT_PANE_DEFAULTS.gutterSize);
    const [isDisabled, setIsDisabled] = useState(SplitPaneKnobs.STARTING_IS_DISABLED);

    return (
        <>
            <PageDocsAlert severity={"alert"}>
                Each divider can be dragged, pressed to step it towards the side pressed, so dragging is never the only
                way (<a href={WCAG_URLS["2.5.7"]}>WCAG 2.5.7</a>), or focused and moved with the arrow keys, with Home
                and End for the ends and Enter to fold the pane before it away and bring it back. What it cannot do is
                name itself: give every pane but the last a{" "}
                <span className={docsStyles.docsPropName}>gutterAriaLabel</span> saying what its divider resizes, or a
                screen reader hears a separator with no name (<a href={WCAG_URLS["4.1.2"]}>WCAG 4.1.2</a>). A missing
                one is warned about in the console.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"orientation"}
                            label={"Orientation"}
                            hint={
                                "Whether the panes sit side by side or stack. Stacked, the divider lies across between them and the up and down arrows move it."
                            }
                            controls={"Sets SplitPaneProps.orientation"}
                        >
                            <PageSelectField
                                value={orientation}
                                values={SPLIT_PANE_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={setOrientation}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"gutterSize"}
                            label={"Gutter size (px)"}
                            hint={"How wide the draggable divider between two panes is."}
                            controls={"Sets SplitPaneProps.gutterSize"}
                        >
                            <PageNumberField
                                value={gutterSize}
                                min={SplitPaneKnobs.MIN_GUTTER}
                                max={SplitPaneKnobs.MAX_GUTTER}
                                step={SplitPaneKnobs.GUTTER_STEP}
                                width={GUTTER_FIELD_WIDTH}
                                ariaLabel={"Gutter size in pixels"}
                                onInput={setGutterSize}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={"Turns the divider off, so the panes keep the sizes they have."}
                            controls={"Sets SplitPaneProps.isDisabled"}
                        >
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample orientation={orientation} gutterSize={gutterSize} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the first pane sits on the right, and the divider follows the pointer and the arrow keys from that side: the left arrow grows the first pane."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Bounded panes"}
                content={
                    "Each entry in [prop]panes[/prop] can give its pane a [prop]minPx[/prop] and a [prop]maxPx[/prop]. The pane is held between them whatever its ratio says, so this sidebar stays between 120 and 220 pixels wide while the stored ratio is left as the reader set it."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Bounded.tsx`}>
                <BoundedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Three panes"}
                content={
                    "Any number of panes works the same way, with a divider between each pair. A divider moves its two neighbors and nothing else, so dragging at one end never changes the far side."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Triple.tsx`}>
                <TripleDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Two pictures"}
                content={
                    "The panes are the painter's, so they need not squeeze what is in them. Here both pictures are drawn at the full width of the frame, and each pane shows only its own side, so the divider wipes from one picture to the other."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Compare.tsx`}>
                <CompareDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Minimums that do not fit"}
                content={
                    "When the panes' minimums add up to more than the box, the panes keep them and the row overflows, as a CSS grid does: here minimums of 250 and 400 pixels sit in a box at most 600 pixels wide, which scrolls."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Cramped.tsx`}>
                <CrampedDocsExample />
            </PageDocsExample>
        </>
    );
};
