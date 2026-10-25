import { createMemo, createSignal } from "solid-js";

import { Tree, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { createStressFiles } from "../TreePageSolid.const";
import type { TreeVirtualizedDocsExampleProps } from "../TreePageSolid.types";

const NODE_HEIGHT = 28;

type Props = TreeVirtualizedDocsExampleProps;

export const VirtualizedDocsExample = (props: Props) => {
    const expandedSignal = createSignal<string[]>(["package-1", "package-2", "package-3"]);

    const getNodes = createMemo(() => createStressFiles(access(props.count)));

    return (
        <div class={styles.treeScroller}>
            <Tree
                renderHighlightFloater={renderPageHighlightFloater}
                nodes={getNodes}
                expanded={expandedSignal}
                ariaLabel={"Generated repository"}
                computeEstimatedNodeHeight={() => NODE_HEIGHT}
                renderNode={(getNode, getRenderProps) => (
                    <PageTreeNodeContent isGliding renderProps={getRenderProps}>
                        {getNode().value}
                    </PageTreeNodeContent>
                )}
            />
        </div>
    );
};
