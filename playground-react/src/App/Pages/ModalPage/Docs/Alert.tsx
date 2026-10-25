import { useState } from "react";

import { Button, Modal } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { NOTHING_DECIDED } from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalHint, PageModalPanel } from "../../../StyledComponents/ModalPanel/ModalPanel";
import type { ModalAlertDocsExampleProps } from "../ModalPageReact.types";

const ALERT_TITLE_ID = "modal-page-alert-title";
const ALERT_BODY_ID = "modal-page-alert-body";

type Props = ModalAlertDocsExampleProps;

export const AlertDocsExample = (props: Props) => {
    const visibility = useState(false);
    const [outcome, setOutcome] = useState(NOTHING_DECIDED);
    const [cancelRef, setCancelRef] = useState<HTMLElement | null>(null);

    const [, setIsOpen] = visibility;

    const decide = (next: string) => {
        setOutcome(next);
        setIsOpen(false);
    };

    return (
        <>
            <Button
                id={"openAlert"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Delete the project</PageButtonContent>}
                onClick={() => {
                    setOutcome(NOTHING_DECIDED);
                    setIsOpen(true);
                }}
            />

            <Modal
                visibility={visibility}
                role={"alertdialog"}
                initialFocusRef={cancelRef ?? undefined}
                isDismissableOnOverlayClick={props.isDismissableOnOverlayClick}
                isDismissableOnEscape={props.isDismissableOnEscape}
                ariaLabelledBy={ALERT_TITLE_ID}
                ariaDescribedBy={ALERT_BODY_ID}
                renderOverlay={(visibilityTarget, transitionDurationMs) => (
                    <PageModalOverlay visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs} />
                )}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <PageModalPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        <div id={ALERT_TITLE_ID}>Delete this project?</div>

                        <PageModalHint id={ALERT_BODY_ID}>
                            Everything in it goes, and it cannot be undone.
                        </PageModalHint>

                        <div className={styles.buttons}>
                            <Button
                                renderContent={(flags) => <PageButtonContent flags={flags}>Delete</PageButtonContent>}
                                onClick={() => decide("deleted")}
                            />

                            <Button
                                ref={setCancelRef}
                                renderContent={(flags) => <PageButtonContent flags={flags}>Cancel</PageButtonContent>}
                                onClick={() => decide("canceled")}
                            />
                        </div>
                    </PageModalPanel>
                )}
            />

            <div className={exampleStyles.exampleReadout} data-readout>{`Outcome: ${outcome}`}</div>
        </>
    );
};
