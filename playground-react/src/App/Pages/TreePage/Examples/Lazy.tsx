import { useEffect, useRef, useState } from "react";

import { Tree } from "@thewaver/ss-components-react";
import type { TreeNode } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
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
    const [nodes, setNodes] = useState<TreeNode<string>[]>(REMOTE_ROOT);

    const loadedRef = useRef(new Set<string>());

    const expanded = props.expanded[0];

    useEffect(() => {
        const timers = expanded
            .filter((value) => !loadedRef.current.has(value))
            .map((value) =>
                setTimeout(() => {
                    loadedRef.current.add(value);
                    setNodes((prev) => fillBranch(prev, value));
                }, REMOTE_LOAD_DELAY_MS),
            );

        return () => timers.forEach((timer) => clearTimeout(timer));
    }, [expanded]);

    return (
        <Tree
            renderHighlightFloater={renderPageHighlightFloater}
            nodes={nodes}
            value={props.value}
            expanded={props.expanded}
            ariaLabel={"Remote repository"}
            renderNode={(node, renderProps) => (
                <PageTreeNodeContent isGliding renderProps={renderProps}>
                    {node.value}
                </PageTreeNodeContent>
            )}
            renderPendingChildren={(_node, depth) => <PageTreeNodePending depth={depth}>Fetching…</PageTreeNodePending>}
        />
    );
};
