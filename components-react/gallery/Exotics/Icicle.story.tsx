import { useState } from "react";

import type { IcicleNode } from "@thewaver/ss-components";

import { Icicle } from "../../src";
import { LIBRARY, LIBRARY_LABEL, formatLines, pathOf } from "./HierarchyFixtures";

const FRAME_STYLE = { width: "900px", height: "600px" };
const CELL_STYLE = { width: "100%", height: "100%", boxSizing: "border-box", border: "1px solid gray" } as const;

export const Default = ({ zoomDurationMs = 0, columnCount }: { zoomDurationMs?: number; columnCount?: number }) => {
    const focusState = useState<IcicleNode<string>>(LIBRARY);

    return (
        <>
            <div style={FRAME_STYLE}>
                <Icicle<string>
                    root={LIBRARY}
                    focusState={focusState}
                    columnCount={columnCount}
                    zoomDurationMs={zoomDurationMs}
                    ariaLabel={LIBRARY_LABEL}
                    renderCell={(node, state) => (
                        <div style={CELL_STYLE}>
                            {node.value} <span>{formatLines(state.weight)}</span>
                        </div>
                    )}
                />
            </div>
            <output data-readout="library">{`showing ${pathOf(focusState[0])} now`}</output>
        </>
    );
};
