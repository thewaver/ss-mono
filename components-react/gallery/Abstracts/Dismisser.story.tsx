import { useRef, useState } from "react";

import { DismisserReactUtils } from "../../src";

export const Default = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("none");
    const layerRef = useRef<HTMLDivElement>(null);

    DismisserReactUtils.useLayer(isOpen, {
        getRoots: () => [layerRef.current],
        onDismiss: (next) => {
            setReason(next);
            setIsOpen(false);
        },
    });

    return (
        <>
            <button type="button" data-testid="open" onClick={() => setIsOpen(true)}>
                Open
            </button>
            <div data-testid="outside" style={{ width: 200, height: 40 }}>
                Outside
            </div>
            {isOpen && (
                <div ref={layerRef} data-testid="layer">
                    <button type="button">Inside</button>
                </div>
            )}
            <output data-readout="reason">{reason}</output>
        </>
    );
};
