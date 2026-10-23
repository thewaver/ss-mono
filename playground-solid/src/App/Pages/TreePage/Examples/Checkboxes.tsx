import { MultiTree } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import type { TreeCheckboxExampleProps } from "../TreePage.types";
import { FILES } from "../TreePageSolid.const";

type Props = TreeCheckboxExampleProps;

export const CheckboxesExample = (props: Props) => {
    return (
        <MultiTree
            renderHighlightFloater={renderPageHighlightFloater}
            nodes={FILES}
            checked={props.checked}
            expanded={props.expanded}
            ariaLabel={"Files to include"}
            renderNode={(getNode, getRenderProps, setExpanderRef) => (
                <PageTreeNodeContent isGliding hasCheckbox renderProps={getRenderProps} setExpanderRef={setExpanderRef}>
                    {getNode().value}
                </PageTreeNodeContent>
            )}
        />
    );
};
