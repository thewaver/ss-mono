import { useState } from "react";

import { Button, Modal } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalPanel } from "../../../StyledComponents/ModalPanel/ModalPanel";

const TEXT_ONLY_TITLE_ID = "modal-page-text-only-title";

export const TextOnlyDocsExample = () => {
    const visibility = useState(false);

    const [, setIsOpen] = visibility;

    return (
        <>
            <Button
                id={"openNotice"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Open notice</PageButtonContent>}
                onClick={() => {
                    setIsOpen(true);
                }}
            />

            <Modal
                visibility={visibility}
                ariaLabelledBy={TEXT_ONLY_TITLE_ID}
                renderOverlay={(visibilityTarget, transitionDurationMs) => (
                    <PageModalOverlay visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs} />
                )}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <PageModalPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        <div id={TEXT_ONLY_TITLE_ID}>Nothing in here can be clicked.</div>
                        <div>So I hold focus myself. Press Escape to close me.</div>
                    </PageModalPanel>
                )}
            />
        </>
    );
};
