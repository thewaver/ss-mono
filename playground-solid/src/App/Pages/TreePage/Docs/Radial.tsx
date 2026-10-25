import { For, createMemo, createSignal } from "solid-js";

import { Tree } from "@thewaver/ss-components-solid";
import type { TreeNode } from "@thewaver/ss-components-solid";
import { RADIAL_DEFS } from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.css";
import { TreePageUtils } from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.utils";

import { PageTreeConnector, PageTreeRadialNode } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { RANKS, RANK_ROOTS } from "../TreePageSolid.const";

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
    const expandedSignal = createSignal<string[]>(RANK_ROOTS);

    const getRankRadii = createMemo(() =>
        [...toShownDepths(RANKS, expandedSignal[0](), ROOT_DEPTH, new Set())]
            .filter((depth) => depth > ROOT_DEPTH)
            .map((depth) => RADIAL_DEFS.innerRadius + RADIAL_DEFS.ringGap * depth),
    );

    const getStageWidth = () => `${(Math.max(...getRankRadii(), ROOT_DEPTH) + RADIAL_DEFS.itemWidth * HALF) * 2}px`;

    return (
        <div class={styles.rankStage}>
            <For each={getRankRadii()}>
                {(radius) => (
                    <div
                        class={styles.rankRing}
                        style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
                        aria-hidden={"true"}
                    />
                )}
            </For>

            <div style={{ width: getStageWidth() }}>
                <Tree
                    nodes={RANKS}
                    expanded={expandedSignal}
                    ariaLabel={"Ranks"}
                    computeLayout={TreePageUtils.radialLayout}
                    renderConnector={(getDefs) => <PageTreeConnector defs={getDefs} />}
                    renderNode={(getNode, getRenderProps) => (
                        <PageTreeRadialNode renderProps={getRenderProps}>{getNode().value}</PageTreeRadialNode>
                    )}
                />
            </div>
        </div>
    );
};
