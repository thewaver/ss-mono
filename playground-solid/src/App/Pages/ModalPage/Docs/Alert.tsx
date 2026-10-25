import { createSignal } from "solid-js";

import { Button, Modal } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { NOTHING_DECIDED } from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalHint, PageModalPanel } from "../../../StyledComponents/ModalPanel/ModalPanel";
import type { ModalAlertDocsExampleProps } from "../ModalPageSolid.types";

const ALERT_TITLE_ID = "modal-page-alert-title";
const ALERT_BODY_ID = "modal-page-alert-body";

type Props = ModalAlertDocsExampleProps;

export const AlertDocsExample = (props: Props) => {
    const visibility = createSignal(false);
    const [getOutcome, setOutcome] = createSignal(NOTHING_DECIDED);
    const [getCancelRef, setCancelRef] = createSignal<HTMLElement>();

    const [, setIsOpen] = visibility;

    const decide = (outcome: string) => {
        setOutcome(outcome);
        setIsOpen(false);
    };

    return (
        <>
            <Button
                id={"openAlert"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Delete the project</PageButtonContent>}
                onClick={() => {
                    setOutcome(NOTHING_DECIDED);
                    setIsOpen(true);
                }}
            />

            <Modal
                visibility={visibility}
                role={"alertdialog"}
                initialFocusRef={getCancelRef}
                isDismissableOnOverlayClick={props.isDismissableOnOverlayClick}
                isDismissableOnEscape={props.isDismissableOnEscape}
                ariaLabelledBy={ALERT_TITLE_ID}
                ariaDescribedBy={ALERT_BODY_ID}
                renderOverlay={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageModalOverlay
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageModalPanel
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        <div id={ALERT_TITLE_ID}>Delete this project?</div>

                        <PageModalHint id={ALERT_BODY_ID}>
                            Everything in it goes, and it cannot be undone.
                        </PageModalHint>

                        <div class={styles.buttons}>
                            <Button
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>Delete</PageButtonContent>
                                )}
                                onClick={() => decide("deleted")}
                            />

                            <Button
                                ref={setCancelRef}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>Cancel</PageButtonContent>
                                )}
                                onClick={() => decide("canceled")}
                            />
                        </div>
                    </PageModalPanel>
                )}
            />

            <div class={exampleStyles.exampleReadout} data-readout>{`Outcome: ${getOutcome()}`}</div>
        </>
    );
};
