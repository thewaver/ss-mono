import { For, createMemo } from "solid-js";

import { Tree, access, createRadialTree } from "@thewaver/ss-components";
import type { RadialTreeDefs, TreeNode } from "@thewaver/ss-components";

import { PageTreeRadialNode } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { RANKS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

import * as styles from "../TreePage.css";

const RADIAL_DEFS: RadialTreeDefs = { innerRadiusPx: 88, ringGapPx: 96, itemWidthPx: 88, itemHeightPx: 88 };

const RADIAL_LAYOUT = createRadialTree(RADIAL_DEFS);

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

type Props = TreeExampleProps;

export const RadialExample = (props: Props) => {
    const getRankRadii = createMemo(() =>
        [...toShownDepths(RANKS, access(props.expandedSignal[0]), ROOT_DEPTH, new Set())]
            .filter((depth) => depth > ROOT_DEPTH)
            .map((depth) => RADIAL_DEFS.innerRadiusPx! + RADIAL_DEFS.ringGapPx! * depth),
    );

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

            <Tree
                nodes={() => RANKS}
                valueSignal={props.valueSignal}
                expandedSignal={props.expandedSignal}
                ariaLabel={"Ranks"}
                computeLayout={RADIAL_LAYOUT}
                renderNode={(getNode, getRenderProps) => (
                    <PageTreeRadialNode renderProps={getRenderProps}>{getNode().value}</PageTreeRadialNode>
                )}
            />
        </div>
    );
};
