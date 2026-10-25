import { Tree } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES } from "../TreePageReact.const";

export const RightToLeftDocsExample = () => (
    <div dir={"rtl"}>
        <Tree
            renderHighlightFloater={renderPageHighlightFloater}
            nodes={FILES}
            ariaLabel={"Repository"}
            renderNode={(node, renderProps) => (
                <PageTreeNodeContent isGliding renderProps={renderProps}>
                    {node.value}
                </PageTreeNodeContent>
            )}
        />
    </div>
);
