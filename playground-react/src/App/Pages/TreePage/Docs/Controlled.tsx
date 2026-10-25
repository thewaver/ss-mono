import { useState } from "react";

import { Button, Tree } from "@thewaver/ss-components-react";
import type { TreeNode } from "@thewaver/ss-components-react";

import { PageControlRow } from "../../../PageComponents/ControlRow/ControlRow";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES, OUTSIDE_COLLAPSE_DELAY_MS } from "../TreePageReact.const";

const toBranchValues = (nodes: TreeNode<string>[]): string[] =>
    nodes.flatMap((node) => (node.children ? [node.value, ...toBranchValues(node.children)] : []));

export const ControlledDocsExample = () => {
    const expandedState = useState<string[]>(["src", "Lib"]);
    const [, setExpanded] = expandedState;

    return (
        <>
            <Tree
                renderHighlightFloater={renderPageHighlightFloater}
                nodes={FILES}
                expanded={expandedState}
                ariaLabel={"Repository"}
                renderNode={(node, renderProps) => (
                    <PageTreeNodeContent isGliding renderProps={renderProps}>
                        {node.value}
                    </PageTreeNodeContent>
                )}
            />

            <PageControlRow>
                <Button
                    id={"controlledExpandAll"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Expand all</PageButtonContent>}
                    onClick={() => {
                        setExpanded(toBranchValues(FILES));
                    }}
                />

                <Button
                    id={"controlledCollapseAll"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Collapse all</PageButtonContent>}
                    onClick={() => {
                        setExpanded([]);
                    }}
                />

                <Button
                    id={"controlledCollapseLibLater"}
                    renderContent={(flags) => (
                        <PageButtonContent
                            flags={flags}
                        >{`Collapse Lib in ${OUTSIDE_COLLAPSE_DELAY_MS}ms`}</PageButtonContent>
                    )}
                    onClick={() => {
                        setTimeout(() => {
                            setExpanded((prev) => prev.filter((value) => value !== "Lib"));
                        }, OUTSIDE_COLLAPSE_DELAY_MS);
                    }}
                />
            </PageControlRow>
        </>
    );
};
