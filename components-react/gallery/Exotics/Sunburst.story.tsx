import { useState } from "react";

import { type SunburstNode, SunburstUtils, TreemapUtils } from "@thewaver/ss-components";

import { Sunburst } from "../../src";
import { LIBRARY, LIBRARY_LABEL, formatLines, pathOf } from "./HierarchyFixtures";

const FRAME_STYLE = { width: "600px", height: "600px" };
const ROOT_ONLY = 1;

export const Default = ({ zoomDurationMs = 0, ringCount }: { zoomDurationMs?: number; ringCount?: number }) => {
    const branchState = useState<SunburstNode<string>>(LIBRARY);
    const [branch, setBranch] = branchState;
    const path = TreemapUtils.findPath(LIBRARY, branch) ?? [LIBRARY];
    const parent = TreemapUtils.findParent(LIBRARY, branch);

    return (
        <>
            <button
                type="button"
                id="sunburstUp"
                aria-disabled={path.length <= ROOT_ONLY || undefined}
                onClick={() => {
                    if (parent) setBranch(parent);
                }}
            >
                {branch.value}
            </button>
            <div style={FRAME_STYLE}>
                <Sunburst<string>
                    root={LIBRARY}
                    branchState={branchState}
                    ringCount={ringCount}
                    zoomDurationMs={zoomDurationMs}
                    ariaLabel={LIBRARY_LABEL}
                    renderArc={(node, state) => (
                        <>
                            <path d={SunburstUtils.computeArcPath(state, { padLength: 1, ringGap: 1 })} fill="silver">
                                <title>{`${pathOf(node)}\n${formatLines(state.weight)}`}</title>
                            </path>
                            <text
                                transform={SunburstUtils.computeLabelTransform(state)}
                                textAnchor="middle"
                                fontSize={8}
                            >
                                {node.value}
                            </text>
                        </>
                    )}
                />
            </div>
            <output data-readout="library">{`showing ${pathOf(branch)} now`}</output>
        </>
    );
};
