import { Tree } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import type { TreeExampleProps } from "../TreePage.types";
import { DOCS } from "../TreePageReact.const";

type Props = TreeExampleProps;

export const LinksExample = (props: Props) => (
    <Tree
        renderHighlightFloater={renderPageHighlightFloater}
        nodes={DOCS}
        value={props.value}
        expanded={props.expanded}
        ariaLabel={"Documentation"}
        renderNode={(node, renderProps) => (
            <PageTreeNodeContent isGliding renderProps={renderProps}>
                {node.value}
            </PageTreeNodeContent>
        )}
    />
);
