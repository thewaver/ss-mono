import { Tree } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { ASSETS } from "../TreePage.const";
import type { TreeRecordExampleProps } from "../TreePage.types";

type Props = TreeRecordExampleProps;

export const RecordValuesExample = (props: Props) => (
    <Tree
        renderHighlightFloater={renderPageHighlightFloater}
        nodes={ASSETS}
        value={props.value}
        expanded={props.expanded}
        ariaLabel={"Assets"}
        renderNode={(node, renderProps) => (
            <PageTreeNodeContent isGliding renderProps={renderProps} detail={node.value.kind}>
                {node.value.name}
            </PageTreeNodeContent>
        )}
    />
);
