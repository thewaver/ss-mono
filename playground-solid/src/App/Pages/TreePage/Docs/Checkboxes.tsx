import { MultiTree } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES } from "../TreePageSolid.const";

export const CheckboxesDocsExample = () => (
    <MultiTree
        renderHighlightFloater={renderPageHighlightFloater}
        nodes={FILES}
        ariaLabel={"Files to include"}
        renderNode={(getNode, getRenderProps, setExpanderRef) => (
            <PageTreeNodeContent isGliding hasCheckbox renderProps={getRenderProps} setExpanderRef={setExpanderRef}>
                {getNode().value}
            </PageTreeNodeContent>
        )}
    />
);
