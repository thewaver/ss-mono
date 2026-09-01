import { createEffect, createSignal, onCleanup } from "solid-js";

import { Tree } from "@thewaver/ss-components";
import type { TreeNode } from "@thewaver/ss-components";

import { PageTreeNodeContent, PageTreeNodePending } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { REMOTE_CHILDREN, REMOTE_LOAD_DELAY_MS, REMOTE_ROOT } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Props = TreeExampleProps;

const fillBranch = (nodes: TreeNode<string>[], value: string): TreeNode<string>[] =>
    nodes.map((node) => {
        if (node.value === value) return { ...node, children: REMOTE_CHILDREN[value] ?? [], hasMoreChildren: false };

        if (!node.children) return node;

        return { ...node, children: fillBranch(node.children, value) };
    });

export const LazyExample = (props: Props) => {
    const [getNodes, setNodes] = createSignal(REMOTE_ROOT);

    const asked = new Set<string>();

    createEffect(() => {
        const pending = props.expandedSignal[0]().filter((value) => !asked.has(value));

        for (const value of pending) {
            asked.add(value);

            const timer = setTimeout(() => setNodes((prev) => fillBranch(prev, value)), REMOTE_LOAD_DELAY_MS);

            onCleanup(() => clearTimeout(timer));
        }
    });

    return (
        <Tree
            nodes={getNodes}
            valueSignal={props.valueSignal}
            expandedSignal={props.expandedSignal}
            ariaLabel={"Remote repository"}
            renderNode={(getNode, getRenderProps) => (
                <PageTreeNodeContent renderProps={getRenderProps}>{getNode().value}</PageTreeNodeContent>
            )}
            renderPendingChildren={(_getNode, getDepth) => (
                <PageTreeNodePending depth={getDepth}>Fetching…</PageTreeNodePending>
            )}
        />
    );
};
