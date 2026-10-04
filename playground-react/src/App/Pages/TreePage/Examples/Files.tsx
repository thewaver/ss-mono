import { Tree } from "@thewaver/ss-components-react";
import type { TreeNode } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Props = Partial<TreeExampleProps> & { nodes?: TreeNode<string>[] };

export const FilesExample = (props: Props) => {
    return (
        <Tree
            renderHighlightFloater={renderPageHighlightFloater}
            nodes={props.nodes ?? FILES}
            value={props.value}
            expanded={props.expanded}
            ariaLabel={"Repository"}
            renderNode={(node, renderProps) => (
                <PageTreeNodeContent isGliding renderProps={renderProps}>
                    {node.value}
                </PageTreeNodeContent>
            )}
        />
    );
};
