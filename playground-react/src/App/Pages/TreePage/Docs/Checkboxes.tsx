import { MultiTree } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES } from "../TreePageReact.const";

export const CheckboxesDocsExample = () => (
    <MultiTree
        renderHighlightFloater={renderPageHighlightFloater}
        nodes={FILES}
        ariaLabel={"Files to include"}
        renderNode={(node, renderProps, setExpanderRef) => (
            <PageTreeNodeContent isGliding hasCheckbox renderProps={renderProps} setExpanderRef={setExpanderRef}>
                {node.value}
            </PageTreeNodeContent>
        )}
    />
);
