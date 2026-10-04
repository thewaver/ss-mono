import { Tree } from "@thewaver/ss-components-react";
import type { TreeLinkProps } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { DOCS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

const PageTreeLink = (props: TreeLinkProps) => <a {...props} data-link-component="" />;

type Props = TreeExampleProps;

export const LinkComponentExample = (props: Props) => (
    <Tree
        renderHighlightFloater={renderPageHighlightFloater}
        nodes={DOCS}
        value={props.value}
        expanded={props.expanded}
        ariaLabel={"Routed documentation"}
        linkComponent={PageTreeLink}
        renderNode={(node, renderProps) => (
            <PageTreeNodeContent isGliding renderProps={renderProps}>
                {node.value}
            </PageTreeNodeContent>
        )}
    />
);
