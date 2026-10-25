import { useMemo, useState } from "react";

import { Tree } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { createStressFiles } from "../TreePageReact.const";
import type { TreeVirtualizedDocsExampleProps } from "../TreePageReact.types";

const NODE_HEIGHT = 28;

type Props = TreeVirtualizedDocsExampleProps;

export const VirtualizedDocsExample = (props: Props) => {
    const expandedState = useState<string[]>(["package-1", "package-2", "package-3"]);

    const nodes = useMemo(() => createStressFiles(props.count), [props.count]);

    return (
        <div className={styles.treeScroller}>
            <Tree
                renderHighlightFloater={renderPageHighlightFloater}
                nodes={nodes}
                expanded={expandedState}
                ariaLabel={"Generated repository"}
                computeEstimatedNodeHeight={() => NODE_HEIGHT}
                renderNode={(node, renderProps) => (
                    <PageTreeNodeContent isGliding renderProps={renderProps}>
                        {node.value}
                    </PageTreeNodeContent>
                )}
            />
        </div>
    );
};
