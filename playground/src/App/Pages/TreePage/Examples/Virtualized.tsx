import { Tree } from "@thewaver/ss-components";
import type { MaybeAccessor, TreeNode } from "@thewaver/ss-components";

import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import type { TreeExampleProps } from "../TreePage.types";

import * as styles from "../TreePage.css";

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
                renderNode={(getNode, getFlags) => (
                    <PageTreeNodeContent flags={getFlags}>{getNode().value}</PageTreeNodeContent>
                )}
            />
        </div>
    );
};
