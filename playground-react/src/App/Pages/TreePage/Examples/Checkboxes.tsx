import { MultiTree } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import type { TreeCheckboxExampleProps } from "../TreePage.types";
import { FILES } from "../TreePageReact.const";

type Props = TreeCheckboxExampleProps;

export const CheckboxesExample = (props: Props) => {
    return (
        <MultiTree
            renderHighlightFloater={renderPageHighlightFloater}
            nodes={FILES}
            checked={props.checked}
            expanded={props.expanded}
            ariaLabel={"Files to include"}
            renderNode={(node, renderProps, setExpanderRef) => (
                <PageTreeNodeContent isGliding hasCheckbox renderProps={renderProps} setExpanderRef={setExpanderRef}>
                    {node.value}
                </PageTreeNodeContent>
            )}
        />
    );
};
