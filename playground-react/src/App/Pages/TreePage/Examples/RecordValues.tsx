import { Tree } from "@thewaver/ss-components-react";

import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { ASSETS } from "../TreePage.const";
import type { TreeRecordExampleProps } from "../TreePage.types";

type Props = TreeRecordExampleProps;

export const RecordValuesExample = (props: Props) => (
    <Tree
        nodes={ASSETS}
        valueState={props.valueState}
        expandedState={props.expandedState}
        ariaLabel={"Assets"}
        renderNode={(node, renderProps) => (
            <PageTreeNodeContent renderProps={renderProps} detail={node.value.kind}>
                {node.value.name}
            </PageTreeNodeContent>
        )}
    />
);
