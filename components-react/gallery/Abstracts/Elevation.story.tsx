import { useRef, useState } from "react";

import { ElevationReactUtils } from "../../src";

export const Default = () => {
    const [isActive, setIsActive] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);
    const [button, setButton] = useState<HTMLButtonElement>();

    ElevationReactUtils.useElevation(modalRef, isActive, 100);

    const base = ElevationReactUtils.useBase(button);

    return (
        <div ref={modalRef}>
            <button
                type="button"
                ref={(element) => setButton(element ?? undefined)}
                onClick={() => setIsActive((was) => !was)}
            >
                Toggle
            </button>
            <output data-readout="base">{base}</output>
        </div>
    );
};
