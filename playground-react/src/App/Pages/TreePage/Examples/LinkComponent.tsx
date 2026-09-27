import { Tree } from "@thewaver/ss-components-react";
import type { TreeLinkProps } from "@thewaver/ss-components-react";

import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { DOCS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

const PageTreeLink = (props: TreeLinkProps) => <a {...props} data-link-component="" />;

type Props = TreeExampleProps;

export const LinkComponentExample = (props: Props) => (
    <Tree
        nodes={DOCS}
        valueState={props.valueState}
        expandedState={props.expandedState}
        ariaLabel={"Routed documentation"}
        linkComponent={PageTreeLink}
        renderNode={(node, renderProps) => (
            <PageTreeNodeContent renderProps={renderProps}>{node.value}</PageTreeNodeContent>
        )}
    />
);
