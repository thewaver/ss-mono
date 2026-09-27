import { useRef, useState } from "react";

import { AnchorReactUtils } from "../../src";

export const Default = () => {
    const [isOpen, setIsOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);
    const { position, placement, zIndex, setContentRef } = AnchorReactUtils.usePortalPosition(anchorRef, isOpen, {
        placement: { x: "right-out", y: "top-in" },
    });

    return (
        <>
            <button
                ref={anchorRef}
                type="button"
                data-testid="anchor"
                style={{ position: "fixed", right: 10, top: 50, width: 80 }}
                onClick={() => setIsOpen(true)}
            >
                Anchor
            </button>
            {isOpen && (
                <div
                    ref={setContentRef}
                    data-testid="popup"
                    style={{
                        position: "fixed",
                        left: position?.x ?? 0,
                        top: position?.y ?? 0,
                        width: 150,
                        height: 60,
                        zIndex,
                    }}
                >
                    Popup
                </div>
            )}
            <output data-readout="placement">{`${placement.x} ${placement.y}`}</output>
            <output data-readout="positioned">{String(position !== undefined)}</output>
            <output data-readout="zIndex">{zIndex}</output>
        </>
    );
};
