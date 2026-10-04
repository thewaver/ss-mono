import { Tree } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { ASSETS } from "../TreePage.const";
import type { TreeRecordExampleProps } from "../TreePage.types";

type Props = TreeRecordExampleProps;

export const RecordValuesExample = (props: Props) => (
    <Tree
        renderHighlightFloater={renderPageHighlightFloater}
        nodes={() => ASSETS}
        value={props.value}
        expanded={props.expanded}
        ariaLabel={"Assets"}
        renderNode={(getNode, getRenderProps) => (
            <PageTreeNodeContent isGliding renderProps={getRenderProps} detail={() => getNode().value.kind}>
                {getNode().value.name}
            </PageTreeNodeContent>
        )}
    />
);
