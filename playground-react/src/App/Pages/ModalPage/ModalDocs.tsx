import { useState } from "react";

import type { ModalAlignment } from "@thewaver/ss-components-react";
import { MODAL_ALIGNMENTS, MODAL_DEFAULTS } from "@thewaver/ss-components-react";
import { ModalKnobs } from "@thewaver/ss-playground/App/Knobs/Modals.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { DOCS_ROOT, DOCS_SECTIONS, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.const";

import { PageDocsAlert } from "../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { AlertDocsExample } from "./Docs/Alert";
import { BasicDocsExample } from "./Docs/Basic";
import { DraggingDocsExample } from "./Docs/Dragging";
import { LayeredDocsExample } from "./Docs/Layered";
import { TextOnlyDocsExample } from "./Docs/TextOnly";

export const ModalDocs = () => {
    const [alignment, setAlignment] = useState<ModalAlignment>(MODAL_DEFAULTS.alignment);
    const [transitionDurationMs, setTransitionDurationMs] = useState(MODAL_DEFAULTS.transitionDurationMs);
    const [isDismissableOnOverlayClick, setIsDismissableOnOverlayClick] = useState(false);
    const [isDismissableOnEscape, setIsDismissableOnEscape] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"alignment"} {...ModalKnobs.ALIGNMENT_TEXT}>
                            <PageSelectField
                                value={alignment}
                                values={MODAL_ALIGNMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Alignment"}
                                onChange={setAlignment}
                            />
                        </PageProp>

                        <PageProp itemKey={"transitionDurationMs"} {...ModalKnobs.TRANSITION_DURATION_MS_TEXT}>
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
                <BasicDocsExample alignment={alignment} transitionDurationMs={transitionDurationMs} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.dialogThatMustBeAnswered} />

            <PageDocsAlert severity={"alert"}>
                With both <span className={docsStyles.docsPropName}>isDismissableOnOverlayClick</span> and{" "}
                <span className={docsStyles.docsPropName}>isDismissableOnEscape</span> off, the dialog has no way out of
                its own. Put a control inside it that closes it, as Delete and Cancel do here, or a keyboard user is
                shut in (<a href={WCAG_URLS["2.1.2"]}>WCAG 2.1.2</a>). The library cannot tell whether you have.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Alert.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"isDismissableOnOverlayClick"}
                            {...ModalKnobs.IS_DISMISSABLE_ON_OVERLAY_CLICK_TEXT}
                        >
                            <PageCheckField
                                value={isDismissableOnOverlayClick}
                                ariaLabel={"Closes on overlay click"}
                                onChange={setIsDismissableOnOverlayClick}
                            />
                        </PageProp>

                        <PageProp itemKey={"isDismissableOnEscape"} {...ModalKnobs.IS_DISMISSABLE_ON_ESCAPE_TEXT}>
                            <PageCheckField
                                value={isDismissableOnEscape}
                                ariaLabel={"Closes on Escape"}
                                onChange={setIsDismissableOnEscape}
                            />
                        </PageProp>
                    </>
                )}
            >
                <AlertDocsExample
                    isDismissableOnOverlayClick={isDismissableOnOverlayClick}
                    isDismissableOnEscape={isDismissableOnEscape}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.popupInside} />

            <PageDocsExample path={`${DOCS_ROOT}/Layered.tsx`}>
                <LayeredDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.dragInside} />

            <PageDocsExample path={`${DOCS_ROOT}/Dragging.tsx`}>
                <DraggingDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.nothingFocusableInside} />

            <PageDocsExample path={`${DOCS_ROOT}/TextOnly.tsx`}>
                <TextOnlyDocsExample />
            </PageDocsExample>
        </>
    );
};
