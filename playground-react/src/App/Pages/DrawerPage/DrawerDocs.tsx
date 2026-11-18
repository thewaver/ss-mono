import { useState } from "react";

import { DRAWER_EDGES, MODAL_DEFAULTS } from "@thewaver/ss-components-react";
import type { DrawerEdge } from "@thewaver/ss-components-react";
import { DrawerKnobs } from "@thewaver/ss-playground/App/Knobs/Drawers.const";
import { ModalKnobs } from "@thewaver/ss-playground/App/Knobs/Modals.const";
import { DOCS_ROOT, DOCS_SECTIONS, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { SwipeDocsExample } from "./Docs/Swipe";

export const DrawerDocs = () => {
    const [edge, setEdge] = useState<DrawerEdge>(DRAWER_EDGES[0]);
    const [transitionDurationMs, setTransitionDurationMs] = useState(MODAL_DEFAULTS.transitionDurationMs);
    const [isDismissableOnOverlayClick, setIsDismissableOnOverlayClick] = useState(
        MODAL_DEFAULTS.isDismissableOnOverlayClick,
    );

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"edge"} {...DrawerKnobs.EDGE_TEXT}>
                            <PageSelectField value={edge} values={DRAWER_EDGES} ariaLabel={"Edge"} onChange={setEdge} />
                        </PageProp>

                        <PageProp itemKey={"transitionDurationMs"} {...DrawerKnobs.TRANSITION_DURATION_MS_TEXT}>
                            <PageNumberField
                                value={transitionDurationMs}
                                min={ModalKnobs.MIN_TRANSITION_MS}
                                max={ModalKnobs.MAX_TRANSITION_MS}
                                step={ModalKnobs.TRANSITION_STEP_MS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Transition duration in milliseconds"}
                                onInput={setTransitionDurationMs}
                            />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample edge={edge} transitionDurationMs={transitionDurationMs} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.swipingAway} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Swipe.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"isDismissableOnOverlayClick"}
                        {...DrawerKnobs.IS_DISMISSABLE_ON_OVERLAY_CLICK_TEXT}
                    >
                        <PageCheckField
                            value={isDismissableOnOverlayClick}
                            ariaLabel={"Closes on overlay click"}
                            onChange={setIsDismissableOnOverlayClick}
                        />
                    </PageProp>
                )}
            >
                <SwipeDocsExample isDismissableOnOverlayClick={isDismissableOnOverlayClick} />
            </PageDocsExample>
        </>
    );
};
