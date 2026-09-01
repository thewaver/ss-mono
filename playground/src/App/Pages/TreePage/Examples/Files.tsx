import { Tree } from "@thewaver/ss-components";
import type { MaybeAccessor, TreeNode } from "@thewaver/ss-components";

import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Props = TreeExampleProps & { nodes?: MaybeAccessor<TreeNode<string>[]> };

export const FilesExample = (props: Props) => {
    return (
        <Tree
            nodes={props.nodes ?? (() => FILES)}
            valueSignal={props.valueSignal}
            expandedSignal={props.expandedSignal}
            ariaLabel={"Repository"}
            renderNode={(getNode, getRenderProps) => (
                <PageTreeNodeContent renderProps={getRenderProps}>{getNode().value}</PageTreeNodeContent>
            )}
        />
    );
};
