import { Button, Modal } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalPanel } from "../../../StyledComponents/ModalPanel/ModalPanel";
import type { ModalExampleProps } from "../ModalPage.types";

const TEXT_ONLY_TITLE_ID = "modal-page-text-only-title";

type Props = ModalExampleProps;

export const TextOnlyExample = (props: Props) => (
    <>
        <Button
            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Open notice</PageButtonContent>}
            onClick={() => {
                props.visibilitySignal[1](true);
            }}
        />

        <Modal
            visibilitySignal={props.visibilitySignal}
            ariaLabelledBy={() => TEXT_ONLY_TITLE_ID}
            renderOverlay={(getVisibilityTarget, getTransitionDurationMs) => (
                <PageModalOverlay
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                />
            )}
            renderContent={(getVisibilityTarget, getTransitionDurationMs) => (
                <PageModalPanel visibilityTarget={getVisibilityTarget} transitionDurationMs={getTransitionDurationMs}>
                    <div id={TEXT_ONLY_TITLE_ID}>Nothing in here can be clicked.</div>
                    <div>So I hold focus myself. Press Escape to close me.</div>
                </PageModalPanel>
            )}
        />
    </>
);
