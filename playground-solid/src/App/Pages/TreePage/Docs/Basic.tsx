import { Tree } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES } from "../TreePageSolid.const";

export const BasicDocsExample = () => (
    <Tree
        renderHighlightFloater={renderPageHighlightFloater}
        nodes={FILES}
        ariaLabel={"Repository"}
        renderNode={(getNode, getRenderProps) => (
            <PageTreeNodeContent isGliding renderProps={getRenderProps}>
                {getNode().value}
            </PageTreeNodeContent>
        )}
    />
);
