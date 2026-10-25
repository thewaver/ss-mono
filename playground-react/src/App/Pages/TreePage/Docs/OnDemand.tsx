import { useEffect, useRef, useState } from "react";

import { Tree } from "@thewaver/ss-components-react";
import type { TreeNode } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent, PageTreeNodePending } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { REMOTE_CHILDREN, REMOTE_LOAD_DELAY_MS, REMOTE_ROOT } from "../TreePageReact.const";

const fillBranch = (nodes: TreeNode<string>[], value: string): TreeNode<string>[] =>
    nodes.map((node) => {
        if (node.value === value) return { ...node, children: REMOTE_CHILDREN[value] ?? [], hasMoreChildren: false };

        if (!node.children) return node;

        return { ...node, children: fillBranch(node.children, value) };
    });

export const OnDemandDocsExample = () => {
    const expandedState = useState<string[]>([]);
    const [nodes, setNodes] = useState<TreeNode<string>[]>(REMOTE_ROOT);

    const askedRef = useRef(new Set<string>());
    const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

    const expanded = expandedState[0];

    useEffect(() => {
        const pending = expanded.filter((value) => !askedRef.current.has(value));

        for (const value of pending) {
            askedRef.current.add(value);

            const timer = setTimeout(() => {
                timersRef.current.delete(value);
                setNodes((prev) => fillBranch(prev, value));
            }, REMOTE_LOAD_DELAY_MS);

            timersRef.current.set(value, timer);
        }
    }, [expanded]);

    useEffect(
        () => () => {
            timersRef.current.forEach((timer, value) => {
                clearTimeout(timer);
                askedRef.current.delete(value);
            });
            timersRef.current.clear();
        },
        [],
    );

    return (
        <Tree
            renderHighlightFloater={renderPageHighlightFloater}
            nodes={nodes}
            expanded={expandedState}
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
