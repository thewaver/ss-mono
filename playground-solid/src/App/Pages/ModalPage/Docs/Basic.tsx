import { createSignal } from "solid-js";

import { Button, Modal } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalPanel } from "../../../StyledComponents/ModalPanel/ModalPanel";
import type { ModalBasicDocsExampleProps } from "../ModalPageSolid.types";

const MODAL_TITLE_ID = "modal-page-title";
const FOCUS_CAPTIONS = ["Focus 1", "Focus 2", "Focus 3"];

type Props = ModalBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const visibility = createSignal(false);

    const [, setIsOpen] = visibility;

    return (
        <>
            <Button
                id={"openModal"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Open Modal</PageButtonContent>}
                onClick={() => {
                    setIsOpen(true);
                }}
            />

            <Modal
                visibility={visibility}
                alignment={props.alignment}
                transitionDurationMs={props.transitionDurationMs}
                ariaLabelledBy={MODAL_TITLE_ID}
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
                        <div id={MODAL_TITLE_ID}>I am a Modal.</div>
                        <div>And I focus trap!</div>

                        <div class={styles.buttons}>
                            {FOCUS_CAPTIONS.map((caption) => (
                                <Button
                                    renderContent={(getFlags) => (
                                        <PageButtonContent flags={getFlags}>{caption}</PageButtonContent>
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
