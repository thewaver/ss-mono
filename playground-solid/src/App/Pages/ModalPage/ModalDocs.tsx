import { createSignal } from "solid-js";

import type { ModalAlignment } from "@thewaver/ss-components-solid";
import { MODAL_ALIGNMENTS, MODAL_DEFAULTS } from "@thewaver/ss-components-solid";
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
    const [getAlignment, setAlignment] = createSignal<ModalAlignment>(MODAL_DEFAULTS.alignment);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(MODAL_DEFAULTS.transitionDurationMs);
    const [getIsDismissableOnOverlayClick, setIsDismissableOnOverlayClick] = createSignal(false);
    const [getIsDismissableOnEscape, setIsDismissableOnEscape] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"alignment"} {...ModalKnobs.ALIGNMENT_TEXT}>
                            <PageSelectField
                                value={getAlignment}
                                values={MODAL_ALIGNMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Alignment"}
                                onChange={(alignment) => setAlignment(() => alignment)}
                            />
                        </PageProp>

                        <PageProp key={"transitionDurationMs"} {...ModalKnobs.TRANSITION_DURATION_MS_TEXT}>
                            <PageNumberField
                                value={getTransitionDurationMs}
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
                <BasicDocsExample alignment={getAlignment} transitionDurationMs={getTransitionDurationMs} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.dialogThatMustBeAnswered} />

            <PageDocsAlert severity={"alert"}>
                With both <span class={docsStyles.docsPropName}>isDismissableOnOverlayClick</span> and{" "}
                <span class={docsStyles.docsPropName}>isDismissableOnEscape</span> off, the dialog has no way out of its
                own. Put a control inside it that closes it, as Delete and Cancel do here, or a keyboard user is shut in
                (<a href={WCAG_URLS["2.1.2"]}>WCAG 2.1.2</a>). The library cannot tell whether you have.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Alert.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"isDismissableOnOverlayClick"}
                            {...ModalKnobs.IS_DISMISSABLE_ON_OVERLAY_CLICK_TEXT}
                        >
                            <PageCheckField
                                value={getIsDismissableOnOverlayClick}
                                ariaLabel={"Closes on overlay click"}
                                onChange={setIsDismissableOnOverlayClick}
                            />
                        </PageProp>

                        <PageProp key={"isDismissableOnEscape"} {...ModalKnobs.IS_DISMISSABLE_ON_ESCAPE_TEXT}>
                            <PageCheckField
                                value={getIsDismissableOnEscape}
                                ariaLabel={"Closes on Escape"}
                                onChange={setIsDismissableOnEscape}
                            />
                        </PageProp>
                    </>
                )}
            >
                <AlertDocsExample
                    isDismissableOnOverlayClick={getIsDismissableOnOverlayClick}
                    isDismissableOnEscape={getIsDismissableOnEscape}
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
