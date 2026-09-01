import { Tree } from "@thewaver/ss-components";

import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { DOCS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Props = TreeExampleProps;

export const LinksExample = (props: Props) => (
    <Tree
        nodes={() => DOCS}
        valueSignal={props.valueSignal}
        expandedSignal={props.expandedSignal}
        ariaLabel={"Documentation"}
        renderNode={(getNode, getRenderProps) => (
            <PageTreeNodeContent renderProps={getRenderProps}>{getNode().value}</PageTreeNodeContent>
        )}
    />
);
