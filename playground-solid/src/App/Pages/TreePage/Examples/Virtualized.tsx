import { Tree } from "@thewaver/ss-components-solid";
import type { MaybeAccessor, TreeNode } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import type { TreeExampleProps } from "../TreePage.types";

const STRESS_NODE_HEIGHT = 28;

type Props = TreeExampleProps & { nodes: MaybeAccessor<TreeNode<string>[]> };

export const VirtualizedExample = (props: Props) => {
    return (
        <div class={styles.treeScroller}>
            <Tree
                renderHighlightFloater={renderPageHighlightFloater}
                nodes={props.nodes}
                value={props.value}
                expanded={props.expanded}
                ariaLabel={"Generated repository"}
                computeEstimatedNodeHeight={() => STRESS_NODE_HEIGHT}
                renderNode={(getNode, getRenderProps) => (
                    <PageTreeNodeContent isGliding renderProps={getRenderProps}>
                        {getNode().value}
                    </PageTreeNodeContent>
                )}
            />
        </div>
    );
};
