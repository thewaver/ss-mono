import { Button, Modal } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalPanel } from "../../../StyledComponents/ModalPanel/ModalPanel";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ModalExampleProps } from "../ModalPage.types";

const MODAL_TITLE_ID = "modal-page-title";
const FOCUS_CAPTIONS = ["Focus 1", "Focus 2", "Focus 3"];

type Props = ModalExampleProps;

export const DefaultExample = (props: Props) => (
    <>
        <Button
            tooltipDefs={{
                placement: { x: "center", y: "top-out" },
                offset: { x: 0, y: 10 },
                renderContent: (visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        Click me to open a Modal.
                    </PageTooltipContent>
                ),
            }}
            id={"openModal"}
            renderContent={(flags) => <PageButtonContent flags={flags}>Open Modal</PageButtonContent>}
            onClick={() => {
                props.visibilityState[1](true);
            }}
        />

        <Modal
            visibilityState={props.visibilityState}
            ariaLabelledBy={MODAL_TITLE_ID}
            renderOverlay={(visibilityTarget, transitionDurationMs) => (
                <PageModalOverlay visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs} />
            )}
            renderContent={(visibilityTarget, transitionDurationMs) => (
                <PageModalPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    <div id={MODAL_TITLE_ID}>I am a Modal.</div>
                    <div>And I focus trap!</div>

                    <div className={styles.buttons}>
                        {FOCUS_CAPTIONS.map((caption) => (
                            <Button
                                key={caption}
                                renderContent={(flags) => (
                                    <PageButtonContent flags={flags}>{caption}</PageButtonContent>
                                )}
                            />
                        ))}
                    </div>
                </PageModalPanel>
            )}
        />
    </>
);
