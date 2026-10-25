import { useState } from "react";

import { Button, Modal } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalPanel } from "../../../StyledComponents/ModalPanel/ModalPanel";
import type { ModalBasicDocsExampleProps } from "../ModalPageReact.types";

const MODAL_TITLE_ID = "modal-page-title";
const FOCUS_CAPTIONS = ["Focus 1", "Focus 2", "Focus 3"];

type Props = ModalBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const visibility = useState(false);

    const [, setIsOpen] = visibility;

    return (
        <>
            <Button
                id={"openModal"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Open Modal</PageButtonContent>}
                onClick={() => {
                    setIsOpen(true);
                }}
            />

            <Modal
                visibility={visibility}
                alignment={props.alignment}
                transitionDurationMs={props.transitionDurationMs}
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
};
