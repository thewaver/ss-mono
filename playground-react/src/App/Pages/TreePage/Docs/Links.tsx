import { useState } from "react";

import { Tree } from "@thewaver/ss-components-react";
import type { TreeLinkProps } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { DOCS } from "../TreePageReact.const";
import type { TreeLinksDocsExampleProps } from "../TreePageReact.types";

type Props = TreeLinksDocsExampleProps;

const CustomTreeLink = (props: TreeLinkProps) => <a {...props} data-link-component />;

export const LinksDocsExample = (props: Props) => {
    const expandedState = useState<string[]>(["Guides"]);

    return (
        <Tree
            renderHighlightFloater={renderPageHighlightFloater}
            nodes={DOCS}
            expanded={expandedState}
            ariaLabel={"Documentation"}
            linkComponent={props.hasLinkComponent ? CustomTreeLink : undefined}
            renderNode={(node, renderProps) => (
                <PageTreeNodeContent isGliding renderProps={renderProps}>
                    {node.value}
                </PageTreeNodeContent>
            )}
        />
    );
};
