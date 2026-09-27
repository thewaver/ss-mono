import { useRef, useState } from "react";

import { FocusManagerReactUtils } from "../../src";

export const Default = () => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const initialRef = useRef<HTMLButtonElement>(null);

    FocusManagerReactUtils.useAutoFocus(panelRef, isOpen, { initialRef });

    return (
        <>
            <button type="button" data-testid="toggle" onClick={() => setIsOpen(true)}>
                Open
            </button>
            {isOpen && (
                <div ref={panelRef}>
                    <button type="button">First</button>
                    <button type="button" ref={initialRef} data-testid="initial">
                        Second
                    </button>
                    <button type="button" data-testid="close" onClick={() => setIsOpen(false)}>
                        Close
                    </button>
                </div>
            )}
        </>
    );
};
