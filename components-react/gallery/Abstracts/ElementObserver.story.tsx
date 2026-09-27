import { useRef, useState } from "react";

import { ElementObserverReactUtils } from "../../src";

export const Size = () => {
    const [width, setWidth] = useState(100);
    const ref = useRef<HTMLDivElement>(null);
    const size = ElementObserverReactUtils.useBorderBoxSize(ref);

    return (
        <>
            <button type="button" onClick={() => setWidth(160)}>
                Grow
            </button>
            <div ref={ref} style={{ width, height: 40, padding: 5, border: "5px solid" }} />
            <output data-readout="size">{`${size.width}x${size.height}`}</output>
        </>
    );
};

export const Progress = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRef = useRef<HTMLDivElement>(null);
    const progress = ElementObserverReactUtils.useScrollContainerProgress(itemRef, containerRef);
    const isIntersecting = ElementObserverReactUtils.useViewportIntersection(itemRef);

    return (
        <>
            <div ref={containerRef} data-testid="container" style={{ height: 200, overflowY: "auto" }}>
                <div style={{ height: 200 }} />
                <div ref={itemRef} style={{ height: 50 }}>
                    Item
                </div>
                <div style={{ height: 400 }} />
            </div>
            <output data-readout="progress">{progress.toFixed(2)}</output>
            <output data-readout="intersecting">{String(isIntersecting)}</output>
        </>
    );
};
