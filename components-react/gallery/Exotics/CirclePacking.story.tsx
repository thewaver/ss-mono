import { useState } from "react";

import type { CirclePackingNode } from "@thewaver/ss-components";

import { CirclePacking } from "../../src";
import { LIBRARY, LIBRARY_LABEL, formatLines, pathOf } from "./HierarchyFixtures";

const FRAME_STYLE = { width: "600px", height: "600px" };

export const Default = ({ zoomDurationMs = 0 }: { zoomDurationMs?: number }) => {
    const branchState = useState<CirclePackingNode<string>>(LIBRARY);

    return (
        <>
            <div style={FRAME_STYLE}>
                <CirclePacking<string>
                    root={LIBRARY}
                    branchState={branchState}
                    zoomDurationMs={zoomDurationMs}
                    ariaLabel={LIBRARY_LABEL}
                    renderCircle={(node, state) => (
                        <circle
                            cx={state.x}
                            cy={state.y}
                            r={Math.max(0, state.radius)}
                            fill={state.isBranch ? "silver" : "white"}
                            stroke="gray"
                        >
                            <title>{`${pathOf(node)}\n${formatLines(state.weight)}`}</title>
                        </circle>
                    )}
                    renderLabel={(node, state) => (
                        <text x={state.x} y={state.y} textAnchor="middle" fillOpacity={state.isInView ? 1 : 0}>
                            {node.value}
                        </text>
                    )}
                />
            </div>
            <output data-readout="library">{`showing ${pathOf(branchState[0])} now`}</output>
        </>
    );
};
