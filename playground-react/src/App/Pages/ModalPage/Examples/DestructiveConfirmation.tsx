import { useState } from "react";

import { Button, Modal } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/ModalPage/ModalPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalHint, PageModalPanel } from "../../../StyledComponents/ModalPanel/ModalPanel";
import type { ModalDestructiveExampleProps } from "../ModalPage.types";

const ALERT_TITLE_ID = "modal-page-alert-title";
const ALERT_BODY_ID = "modal-page-alert-body";

type Props = ModalDestructiveExampleProps;

export const DestructiveConfirmationExample = (props: Props) => {
    const [cancelRef, setCancelRef] = useState<HTMLElement | null>(null);

    const decide = (outcome: string) => {
        props.onDecide(outcome);
        props.visibilityState[1](false);
    };

    return (
        <>
            <Button
                renderContent={(flags) => <PageButtonContent flags={flags}>Delete the project</PageButtonContent>}
                onClick={() => {
                    props.onDecide("nothing decided yet");
                    props.visibilityState[1](true);
                }}
            />

            <Modal
                visibilityState={props.visibilityState}
                role={"alertdialog"}
                initialFocusRef={cancelRef ?? undefined}
                isDismissableOnOverlayClick={false}
                isDismissableOnEscape={false}
                ariaLabelledBy={ALERT_TITLE_ID}
                ariaDescribedBy={ALERT_BODY_ID}
                renderOverlay={(visibilityTarget, transitionDurationMs) => (
                    <PageModalOverlay visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs} />
                )}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <PageModalPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        <div id={ALERT_TITLE_ID}>Delete this project?</div>

                        <PageModalHint id={ALERT_BODY_ID}>
                            Clicking the overlay and pressing Escape both do nothing here — an alert has to be answered.
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
        </>
    );
};
