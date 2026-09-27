import { useState } from "react";

import type { PopupTriggerFlags } from "@thewaver/ss-components";

import { InteractionWrapper, Label, Popover, PopupTrigger } from "../../src";

const POPUP_ID = "popup";

export const Default = ({ isDisabled = false }: { isDisabled?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [trigger, setTrigger] = useState<HTMLElement>();

    return (
        <>
            <InteractionWrapper<PopupTriggerFlags>
                ref={(element) => setTrigger(element ?? undefined)}
                isDisabled={isDisabled}
                extraFlags={{ isOpen }}
                renderControl={(setElementRef, flags) => (
                    <PopupTrigger
                        id="trigger"
                        ref={setElementRef}
                        popupId={POPUP_ID}
                        isOpen={isOpen}
                        flags={flags}
                        renderContent={(triggerFlags) => <span>{triggerFlags.isOpen ? "Open" : "Closed"}</span>}
                        onToggle={() => setIsOpen((was) => !was)}
                    />
                )}
            />
            <output data-readout="open">{String(isOpen)}</output>
            <Popover
                id={POPUP_ID}
                role="dialog"
                ariaAttributes={{ "aria-label": "Details" }}
                isOpen={isOpen}
                anchorRef={trigger}
                hasAutoFocus={true}
                onDismiss={() => setIsOpen(false)}
                renderContent={() => (
                    <div style={{ background: "white" }}>
                        <button type="button" data-testid="inside">
                            Inside
                        </button>
                    </div>
                )}
            />
        </>
    );
};

export const Labeled = () => (
    <Label>
        <span>Caption</span>
        <InteractionWrapper<PopupTriggerFlags>
            extraFlags={{ isOpen: false }}
            renderControl={(setElementRef, flags) => (
                <PopupTrigger
                    id="trigger"
                    ref={setElementRef}
                    ariaLabel="Ignored"
                    popupId={POPUP_ID}
                    isOpen={false}
                    flags={flags}
                    renderContent={() => <span>Go</span>}
                    onToggle={() => undefined}
                />
            )}
        />
    </Label>
);
