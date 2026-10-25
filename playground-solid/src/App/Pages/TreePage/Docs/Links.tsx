import { createSignal } from "solid-js";

import { Tree, access } from "@thewaver/ss-components-solid";
import type { TreeLinkProps } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { DOCS } from "../TreePageSolid.const";
import type { TreeLinksDocsExampleProps } from "../TreePageSolid.types";

type Props = TreeLinksDocsExampleProps;

const CustomTreeLink = (props: TreeLinkProps) => <a {...props} data-link-component />;

export const LinksDocsExample = (props: Props) => {
    const expandedSignal = createSignal<string[]>(["Guides"]);

    return (
        <Tree
            renderHighlightFloater={renderPageHighlightFloater}
            nodes={DOCS}
            expanded={expandedSignal}
            ariaLabel={"Documentation"}
            linkComponent={access(props.hasLinkComponent) ? CustomTreeLink : undefined}
            renderNode={(getNode, getRenderProps) => (
                <PageTreeNodeContent isGliding renderProps={getRenderProps}>
                    {getNode().value}
                </PageTreeNodeContent>
            )}
        />
    );
};
