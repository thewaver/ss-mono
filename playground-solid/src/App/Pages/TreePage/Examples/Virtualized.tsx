import { Tree } from "@thewaver/ss-components-solid";
import type { MaybeAccessor, TreeNode } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.css";

import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import type { TreeExampleProps } from "../TreePage.types";

const STRESS_NODE_HEIGHT = 28;

type Props = TreeExampleProps & { nodes: MaybeAccessor<TreeNode<string>[]> };

export const VirtualizedExample = (props: Props) => {
    return (
        <div class={styles.treeScroller}>
            <Tree
                nodes={props.nodes}
                valueSignal={props.valueSignal}
                expandedSignal={props.expandedSignal}
                ariaLabel={"Generated repository"}
                computeEstimatedNodeHeight={() => STRESS_NODE_HEIGHT}
                renderNode={(getNode, getRenderProps) => (
                    <PageTreeNodeContent renderProps={getRenderProps}>{getNode().value}</PageTreeNodeContent>
                )}
            />
        </div>
    );
};
