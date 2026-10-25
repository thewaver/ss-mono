import { createSignal } from "solid-js";

import { Button, Tree } from "@thewaver/ss-components-solid";
import type { TreeNode } from "@thewaver/ss-components-solid";

import { PageControlRow } from "../../../PageComponents/ControlRow/ControlRow";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES, OUTSIDE_COLLAPSE_DELAY_MS } from "../TreePageSolid.const";

const toBranchValues = (nodes: TreeNode<string>[]): string[] =>
    nodes.flatMap((node) => (node.children ? [node.value, ...toBranchValues(node.children)] : []));

export const ControlledDocsExample = () => {
    const expandedSignal = createSignal<string[]>(["src", "Lib"]);

    return (
        <>
            <Tree
                renderHighlightFloater={renderPageHighlightFloater}
                nodes={FILES}
                expanded={expandedSignal}
                ariaLabel={"Repository"}
                renderNode={(getNode, getRenderProps) => (
                    <PageTreeNodeContent isGliding renderProps={getRenderProps}>
                        {getNode().value}
                    </PageTreeNodeContent>
                )}
            />

            <PageControlRow>
                <Button
                    id={"controlledExpandAll"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Expand all</PageButtonContent>}
                    onClick={() => {
                        expandedSignal[1](toBranchValues(FILES));
                    }}
                />

                <Button
                    id={"controlledCollapseAll"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Collapse all</PageButtonContent>}
                    onClick={() => {
                        expandedSignal[1]([]);
                    }}
                />

                <Button
                    id={"controlledCollapseLibLater"}
                    renderContent={(getFlags) => (
                        <PageButtonContent
                            flags={getFlags}
                        >{`Collapse Lib in ${OUTSIDE_COLLAPSE_DELAY_MS}ms`}</PageButtonContent>
                    )}
                    onClick={() => {
                        setTimeout(() => {
                            expandedSignal[1]((prev) => prev.filter((value) => value !== "Lib"));
                        }, OUTSIDE_COLLAPSE_DELAY_MS);
                    }}
                />
            </PageControlRow>
        </>
    );
};
