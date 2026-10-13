import { Tree } from "@thewaver/ss-components-solid";
import type { MaybeAccessor, TreeNode } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import type { TreeExampleProps } from "../TreePage.types";
import { FILES } from "../TreePageSolid.const";

type Props = Partial<TreeExampleProps> & { nodes?: MaybeAccessor<TreeNode<string>[]> };

export const FilesExample = (props: Props) => {
    return (
        <Tree
            renderHighlightFloater={renderPageHighlightFloater}
            nodes={props.nodes ?? (() => FILES)}
            value={props.value}
            expanded={props.expanded}
            ariaLabel={"Repository"}
            renderNode={(getNode, getRenderProps) => (
                <PageTreeNodeContent isGliding renderProps={getRenderProps}>
                    {getNode().value}
                </PageTreeNodeContent>
            )}
        />
    );
};
