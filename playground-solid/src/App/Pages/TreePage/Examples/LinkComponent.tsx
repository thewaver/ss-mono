import { Tree } from "@thewaver/ss-components-solid";
import type { TreeLinkProps } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { DOCS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

const PageTreeLink = (props: TreeLinkProps) => <a {...props} data-link-component />;

type Props = TreeExampleProps;

export const LinkComponentExample = (props: Props) => (
    <Tree
        renderHighlightFloater={renderPageHighlightFloater}
        nodes={() => DOCS}
        value={props.value}
        expanded={props.expanded}
        ariaLabel={"Routed documentation"}
        linkComponent={PageTreeLink}
        renderNode={(getNode, getRenderProps) => (
            <PageTreeNodeContent isGliding renderProps={getRenderProps}>
                {getNode().value}
            </PageTreeNodeContent>
        )}
    />
);
