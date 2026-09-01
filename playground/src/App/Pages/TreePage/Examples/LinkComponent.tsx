import { Tree } from "@thewaver/ss-components";
import type { TreeLinkProps } from "@thewaver/ss-components";

import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { DOCS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

const PageTreeLink = (props: TreeLinkProps) => <a {...props} data-link-component />;

type Props = TreeExampleProps;

export const LinkComponentExample = (props: Props) => (
    <Tree
        nodes={() => DOCS}
        valueSignal={props.valueSignal}
        expandedSignal={props.expandedSignal}
        ariaLabel={"Routed documentation"}
        linkComponent={PageTreeLink}
        renderNode={(getNode, getRenderProps) => (
            <PageTreeNodeContent renderProps={getRenderProps}>{getNode().value}</PageTreeNodeContent>
        )}
    />
);
