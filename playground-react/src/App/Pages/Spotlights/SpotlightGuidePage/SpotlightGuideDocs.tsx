import { useMemo, useState } from "react";

import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-react";
import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, SPOTLIGHT_DEFAULTS } from "@thewaver/ss-components-react";
import { SpotlightGuideKnobs } from "@thewaver/ss-playground/App/Knobs/SpotlightGuides.const";
import { SpotlightKnobs } from "@thewaver/ss-playground/App/Knobs/Spotlights.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.const";
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
    const [padding, setPadding] = useState(PADDING);
    const [transitionDurationMs, setTransitionDurationMs] = useState(SPOTLIGHT_DEFAULTS.transitionDurationMs);
    const [placementX, setPlacementX] = useState<AnchorHPlacement>(SPOTLIGHT_DEFAULTS.popupPlacement.x);
    const [placementY, setPlacementY] = useState<AnchorVPlacement>(SPOTLIGHT_DEFAULTS.popupPlacement.y);
    const [offsetX, setOffsetX] = useState(SPOTLIGHT_DEFAULTS.popupOffset.x);
    const [offsetY, setOffsetY] = useState(SPOTLIGHT_DEFAULTS.popupOffset.y);

    const popupPlacement = useMemo(() => ({ x: placementX, y: placementY }), [placementX, placementY]);
    const popupOffset = useMemo(() => ({ x: offsetX, y: offsetY }), [offsetX, offsetY]);

    return (
        <>
            <PageDocsAlert severity={"alert"}>
                Give every step a sentence in <span className={docsStyles.docsPropName}>announcement</span>. Focus stays
                on the popup's buttons while the step changes under it, so without one a screen-reader user is told
                nothing about the new step (<a href={WCAG_URLS["4.1.3"]}>WCAG 4.1.3</a>). A guide showing a step without
                one warns in the console, once.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"padding"} {...SpotlightGuideKnobs.PADDING_TEXT}>
                            <PageNumberField
                                value={padding}
                                min={SpotlightKnobs.MIN_PADDING}
                                max={SpotlightKnobs.MAX_PADDING}
                                step={SpotlightKnobs.PADDING_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Padding in pixels"}
                                onInput={setPadding}
                            />
                        </PageProp>

                        <PageProp itemKey={"transitionDurationMs"} {...SpotlightGuideKnobs.TRANSITION_DURATION_MS_TEXT}>
                            <PageNumberField
                                value={transitionDurationMs}
                                min={SpotlightKnobs.MIN_DURATION}
                                max={SpotlightKnobs.MAX_DURATION}
                                step={SpotlightKnobs.DURATION_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Transition duration in milliseconds"}
                                onInput={setTransitionDurationMs}
                            />
                        </PageProp>

                        <PageProp itemKey={"popupPlacementX"} {...SpotlightGuideKnobs.POPUP_PLACEMENT_X_TEXT}>
                            <PageSelectField
                                value={placementX}
                                values={ANCHOR_H_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Popup across"}
                                onChange={setPlacementX}
                            />
                        </PageProp>

                        <PageProp itemKey={"popupPlacementY"} {...SpotlightGuideKnobs.POPUP_PLACEMENT_Y_TEXT}>
                            <PageSelectField
                                value={placementY}
                                values={ANCHOR_V_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Popup down"}
                                onChange={setPlacementY}
                            />
                        </PageProp>

                        <PageProp itemKey={"popupOffsetX"} {...SpotlightGuideKnobs.POPUP_OFFSET_X_TEXT}>
                            <PageNumberField
                                value={offsetX}
                                min={SpotlightKnobs.MIN_OFFSET}
                                max={SpotlightKnobs.MAX_OFFSET}
                                step={SpotlightKnobs.OFFSET_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Offset across in pixels"}
                                onInput={setOffsetX}
                            />
                        </PageProp>

                        <PageProp itemKey={"popupOffsetY"} {...SpotlightGuideKnobs.POPUP_OFFSET_Y_TEXT}>
                            <PageNumberField
                                value={offsetY}
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
                    padding={padding}
                    transitionDurationMs={transitionDurationMs}
                    popupPlacement={popupPlacement}
                    popupOffset={popupOffset}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tourStepReaderDoes} />

            <PageDocsExample path={`${DOCS_ROOT}/Tour.tsx`}>
                <TourDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
