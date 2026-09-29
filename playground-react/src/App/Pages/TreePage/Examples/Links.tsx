import { Tree } from "@thewaver/ss-components-react";

import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { DOCS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Props = TreeExampleProps;

export const LinksExample = (props: Props) => (
    <Tree
        nodes={DOCS}
        value={props.value}
        expanded={props.expanded}
        ariaLabel={"Documentation"}
        renderNode={(node, renderProps) => (
            <PageTreeNodeContent renderProps={renderProps}>{node.value}</PageTreeNodeContent>
        )}
    />
);
