import { useState } from "react";

import { Tree } from "@thewaver/ss-components-react";
import type { TreeNode } from "@thewaver/ss-components-react";
import { RADIAL_DEFS } from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.css";
import { TreePageUtils } from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.utils";

import { PageTreeConnector, PageTreeRadialNode } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { RANKS, RANK_ROOTS } from "../TreePageReact.const";

const HALF = 0.5;

const ROOT_DEPTH = 0;

const toShownDepths = (nodes: TreeNode<string>[], expanded: string[], depth: number, into: Set<number>) => {
    for (const node of nodes) {
        into.add(depth);

        if (node.children !== undefined && expanded.includes(node.value)) {
            toShownDepths(node.children, expanded, depth + 1, into);
        }
    }

    return into;
};

export const RadialDocsExample = () => {
    const expandedState = useState<string[]>(RANK_ROOTS);

    const rankRadii = [...toShownDepths(RANKS, expandedState[0], ROOT_DEPTH, new Set())]
        .filter((depth) => depth > ROOT_DEPTH)
        .map((depth) => RADIAL_DEFS.innerRadius + RADIAL_DEFS.ringGap * depth);

    const stageWidth = `${(Math.max(...rankRadii, ROOT_DEPTH) + RADIAL_DEFS.itemWidth * HALF) * 2}px`;

    return (
        <div className={styles.rankStage}>
            {rankRadii.map((radius) => (
                <div
                    key={radius}
                    className={styles.rankRing}
                    style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
                    aria-hidden={"true"}
                />
            ))}

            <div style={{ width: stageWidth }}>
                <Tree
                    nodes={RANKS}
                    expanded={expandedState}
                    ariaLabel={"Ranks"}
                    computeLayout={TreePageUtils.radialLayout}
                    renderConnector={(defs) => <PageTreeConnector defs={defs} />}
                    renderNode={(node, renderProps) => (
                        <PageTreeRadialNode renderProps={renderProps}>{node.value}</PageTreeRadialNode>
                    )}
                />
            </div>
        </div>
    );
};
