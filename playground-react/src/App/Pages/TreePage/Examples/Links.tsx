import { Tree } from "@thewaver/ss-components-react";

import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { DOCS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Props = TreeExampleProps;

export const LinksExample = (props: Props) => (
    <Tree
        nodes={DOCS}
        valueState={props.valueState}
        expandedState={props.expandedState}
        ariaLabel={"Documentation"}
        renderNode={(node, renderProps) => (
            <PageTreeNodeContent renderProps={renderProps}>{node.value}</PageTreeNodeContent>
        )}
    />
);
