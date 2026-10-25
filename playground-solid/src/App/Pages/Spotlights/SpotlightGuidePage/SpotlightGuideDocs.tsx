import { createMemo, createSignal } from "solid-js";

import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-solid";
import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, SPOTLIGHT_DEFAULTS } from "@thewaver/ss-components-solid";
import { SpotlightKnobs } from "@thewaver/ss-playground/App/Knobs/Spotlights.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.const";
import { FIELD_WIDTH, PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";

import { PageDocsAlert } from "../../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../../PageComponents/DocsSection/DocsSection";
import { PageNumberField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { TourDocsExample } from "./Docs/Tour";

export const SpotlightGuideDocs = () => {
    const [getPadding, setPadding] = createSignal(PADDING);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(SPOTLIGHT_DEFAULTS.transitionDurationMs);
    const [getPlacementX, setPlacementX] = createSignal<AnchorHPlacement>(SPOTLIGHT_DEFAULTS.popupPlacement.x);
    const [getPlacementY, setPlacementY] = createSignal<AnchorVPlacement>(SPOTLIGHT_DEFAULTS.popupPlacement.y);
    const [getOffsetX, setOffsetX] = createSignal(SPOTLIGHT_DEFAULTS.popupOffset.x);
    const [getOffsetY, setOffsetY] = createSignal(SPOTLIGHT_DEFAULTS.popupOffset.y);

    const getPopupPlacement = createMemo(() => ({ x: getPlacementX(), y: getPlacementY() }));
    const getPopupOffset = createMemo(() => ({ x: getOffsetX(), y: getOffsetY() }));

    return (
        <>
            <PageDocsAlert severity={"alert"}>
                Give every step a sentence in <span class={docsStyles.docsPropName}>announcement</span>. Focus stays on
                the popup's buttons while the step changes under it, so without one a screen-reader user is told nothing
                about the new step (<a href={WCAG_URLS["4.1.3"]}>WCAG 4.1.3</a>). A guide showing a step without one
                warns in the console, once.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"padding"}
                            label={"Padding (px)"}
                            hint={
                                "How much room is left around the lit element, so the hole is not cut tight against it."
                            }
                            controls={"Sets SpotlightGuideProps.padding"}
                        >
                            <PageNumberField
                                value={getPadding}
                                min={SpotlightKnobs.MIN_PADDING}
                                max={SpotlightKnobs.MAX_PADDING}
                                step={SpotlightKnobs.PADDING_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Padding in pixels"}
                                onInput={setPadding}
                            />
                        </PageProp>

                        <PageProp
                            key={"transitionDurationMs"}
                            label={"Transition duration (ms)"}
                            hint={
                                "How long the guide takes to fade in and out, and to move from one step to the next. At 0 it jumps."
                            }
                            controls={"Sets SpotlightGuideProps.transitionDurationMs"}
                        >
                            <PageNumberField
                                value={getTransitionDurationMs}
                                min={SpotlightKnobs.MIN_DURATION}
                                max={SpotlightKnobs.MAX_DURATION}
                                step={SpotlightKnobs.DURATION_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Transition duration in milliseconds"}
                                onInput={setTransitionDurationMs}
                            />
                        </PageProp>

                        <PageProp
                            key={"popupPlacementX"}
                            label={"Popup across"}
                            hint={
                                "Where the popup sits across the lit element: lined up with an edge from inside, centered, or outside it altogether."
                            }
                            controls={"Sets SpotlightGuideProps.popupPlacement.x"}
                        >
                            <PageSelectField
                                value={getPlacementX}
                                values={ANCHOR_H_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Popup across"}
                                onChange={(placement) => setPlacementX(() => placement)}
                            />
                        </PageProp>

                        <PageProp
                            key={"popupPlacementY"}
                            label={"Popup down"}
                            hint={
                                "Where the popup sits above or below the lit element: lined up with an edge from inside, centered, or outside it altogether."
                            }
                            controls={"Sets SpotlightGuideProps.popupPlacement.y"}
                        >
                            <PageSelectField
                                value={getPlacementY}
                                values={ANCHOR_V_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Popup down"}
                                onChange={(placement) => setPlacementY(() => placement)}
                            />
                        </PageProp>

                        <PageProp
                            key={"popupOffsetX"}
                            label={"Offset across (px)"}
                            hint={"How far the popup is held clear of the lit element sideways."}
                            controls={"Sets SpotlightGuideProps.popupOffset.x"}
                        >
                            <PageNumberField
                                value={getOffsetX}
                                min={SpotlightKnobs.MIN_OFFSET}
                                max={SpotlightKnobs.MAX_OFFSET}
                                step={SpotlightKnobs.OFFSET_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Offset across in pixels"}
                                onInput={setOffsetX}
                            />
                        </PageProp>

                        <PageProp
                            key={"popupOffsetY"}
                            label={"Offset down (px)"}
                            hint={"How far the popup is held clear of the lit element above or below it."}
                            controls={"Sets SpotlightGuideProps.popupOffset.y"}
                        >
                            <PageNumberField
                                value={getOffsetY}
                                min={SpotlightKnobs.MIN_OFFSET}
                                max={SpotlightKnobs.MAX_OFFSET}
                                step={SpotlightKnobs.OFFSET_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Offset down in pixels"}
                                onInput={setOffsetY}
                            />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample
                    padding={getPadding}
                    transitionDurationMs={getTransitionDurationMs}
                    popupPlacement={getPopupPlacement}
                    popupOffset={getPopupOffset}
                />
            </PageDocsExample>

            <PageDocsSection
                title={"A tour with a step the reader does"}
                content={
                    "A guide seals the whole page, so the element it lights cannot be pressed. For a step the reader is to do, open a SpotlightPrompt over the guide: the guide fades but stays open while the prompt lights the one control, and using the control brings the guide back on the next step. Escape on the prompt brings the guide back on the same step. Escape on the guide closes it, and the tour pauses where it was. The example also keeps the step in sessionStorage, so a reload offers to resume there."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Tour.tsx`}>
                <TourDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "The popup takes the direction of the element it lights, so inside a box whose text runs right to left, the popup's text and buttons run from the right too. The hole and the overlay are not text, and stay as they are."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
