import { Tree } from "@thewaver/ss-components-react";
import type { TreeNode } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/TreePage/TreePage.css";

import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import type { TreeExampleProps } from "../TreePage.types";

const STRESS_NODE_HEIGHT = 28;

type Props = TreeExampleProps & { nodes: TreeNode<string>[] };

export const VirtualizedExample = (props: Props) => {
    return (
        <div className={styles.treeScroller}>
            <Tree
                nodes={props.nodes}
                valueState={props.valueState}
                expandedState={props.expandedState}
                ariaLabel={"Generated repository"}
                computeEstimatedNodeHeight={() => STRESS_NODE_HEIGHT}
                renderNode={(node, renderProps) => (
                    <PageTreeNodeContent renderProps={renderProps}>{node.value}</PageTreeNodeContent>
                )}
            />
        </div>
    );
};
