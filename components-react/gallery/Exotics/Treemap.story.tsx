import { useState } from "react";

import { type TreemapNode, TreemapUtils } from "@thewaver/ss-components";

import { Treemap } from "../../src";
import { LIBRARY, LIBRARY_LABEL, formatLines, pathOf } from "./HierarchyFixtures";

const FRAME_STYLE = { width: "800px", height: "500px" };
const TILE_STYLE = { width: "100%", height: "100%", boxSizing: "border-box", border: "1px solid gray" } as const;
const ROOT_ONLY = 1;

export const Default = ({ zoomDurationMs = 0 }: { zoomDurationMs?: number }) => {
    const branchState = useState<TreemapNode<string>>(LIBRARY);
    const [branch, setBranch] = branchState;
    const path = TreemapUtils.findPath(LIBRARY, branch) ?? [LIBRARY];
    const parent = TreemapUtils.findParent(LIBRARY, branch);

    return (
        <>
            <button
                type="button"
                id="treemapUp"
                aria-disabled={path.length <= ROOT_ONLY || undefined}
                onClick={() => {
                    if (parent) setBranch(parent);
                }}
            >
                Up
            </button>
            <div style={FRAME_STYLE}>
                <Treemap<string>
                    root={LIBRARY}
                    branchState={branchState}
                    zoomDurationMs={zoomDurationMs}
                    ariaLabel={LIBRARY_LABEL}
                    renderTile={(node, state) => (
                        <div style={TILE_STYLE}>
                            <span>{node.value}</span> <span>{formatLines(state.weight)}</span>
                        </div>
                    )}
                />
            </div>
            <output data-readout="library">{`showing ${pathOf(branch)} now`}</output>
        </>
    );
};

export const Uncontrolled = () => (
    <div style={FRAME_STYLE}>
        <Treemap<string>
            root={LIBRARY}
            zoomDurationMs={0}
            ariaLabel={LIBRARY_LABEL}
            renderTile={(node) => <div style={TILE_STYLE}>{node.value}</div>}
        />
    </div>
);
