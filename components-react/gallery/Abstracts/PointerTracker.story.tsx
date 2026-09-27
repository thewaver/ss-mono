import { useRef } from "react";

import { PointerTrackerReactUtils } from "../../src";

export const Default = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(ref);

    return (
        <>
            <div ref={ref} data-testid="box" style={{ width: 200, height: 100, margin: 100, background: "#ddd" }} />
            <output data-readout="edgeRatio">
                {Number.isFinite(reading.edgeRatio) ? reading.edgeRatio.toFixed(2) : "far"}
            </output>
            <output data-readout="present">{String(isPointerPresent)}</output>
        </>
    );
};
