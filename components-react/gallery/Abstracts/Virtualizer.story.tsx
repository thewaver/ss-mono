import { useRef } from "react";

import { VirtualizerReactUtils } from "../../src";

const ROW_HEIGHT = 20;

export const Default = () => {
    const ref = useRef<HTMLDivElement>(null);
    const rowWindow = VirtualizerReactUtils.useRowWindow(ref, 1000, {
        computeEstimatedSize: () => ROW_HEIGHT,
        pinnedRows: [900],
    });

    return (
        <div data-testid="scroller" style={{ height: 200, overflowY: "auto" }}>
            <div ref={ref} style={{ position: "relative", height: rowWindow.isLive ? rowWindow.totalSize : undefined }}>
                {rowWindow.rows.map((row) => (
                    <div
                        key={row.index}
                        ref={rowWindow.measureRow(row.index)}
                        data-row={row.index}
                        style={{ position: "absolute", top: rowWindow.getRowStart(row), height: ROW_HEIGHT }}
                    >
                        Row {row.index}
                    </div>
                ))}
            </div>
        </div>
    );
};
