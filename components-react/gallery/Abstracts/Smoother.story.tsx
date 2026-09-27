import { useState } from "react";

import { SmootherReactUtils } from "../../src";

export const Default = ({ smoothingMs = 200 }: { smoothingMs?: number }) => {
    const [target, setTarget] = useState(0);
    const [value] = SmootherReactUtils.useSmoothed([target], smoothingMs);

    return (
        <>
            <button type="button" onClick={() => setTarget(100)}>
                Go
            </button>
            <output data-readout="value">{value.toFixed(2)}</output>
        </>
    );
};
