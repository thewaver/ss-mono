import { createSignal } from "solid-js";

import { Button, Modal } from "@thewaver/ss-components-solid";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalPanel } from "../../../StyledComponents/ModalPanel/ModalPanel";

const TEXT_ONLY_TITLE_ID = "modal-page-text-only-title";

export const TextOnlyDocsExample = () => {
    const visibility = createSignal(false);

    const [, setIsOpen] = visibility;

    return (
        <>
            <Button
                id={"openNotice"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Open notice</PageButtonContent>}
                onClick={() => {
                    setIsOpen(true);
                }}
            />

            <Modal
                visibility={visibility}
                ariaLabelledBy={TEXT_ONLY_TITLE_ID}
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
                        <div id={TEXT_ONLY_TITLE_ID}>Nothing in here can be clicked.</div>
                        <div>So I hold focus myself. Press Escape to close me.</div>
                    </PageModalPanel>
                )}
            />
        </>
    );
};
