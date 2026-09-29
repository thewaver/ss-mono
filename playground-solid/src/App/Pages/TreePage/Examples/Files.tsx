import { Tree } from "@thewaver/ss-components-solid";
import type { MaybeAccessor, TreeNode } from "@thewaver/ss-components-solid";

import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Props = Partial<TreeExampleProps> & { nodes?: MaybeAccessor<TreeNode<string>[]> };

export const FilesExample = (props: Props) => {
    return (
        <Tree
            nodes={props.nodes ?? (() => FILES)}
            value={props.value}
            expanded={props.expanded}
            ariaLabel={"Repository"}
            renderNode={(getNode, getRenderProps) => (
                <PageTreeNodeContent renderProps={getRenderProps}>{getNode().value}</PageTreeNodeContent>
            )}
        />
    );
};
