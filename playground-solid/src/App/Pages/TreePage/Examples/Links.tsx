import { Tree } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { DOCS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Props = TreeExampleProps;

export const LinksExample = (props: Props) => (
    <Tree
        renderHighlightFloater={renderPageHighlightFloater}
        nodes={() => DOCS}
        value={props.value}
        expanded={props.expanded}
        ariaLabel={"Documentation"}
        renderNode={(getNode, getRenderProps) => (
            <PageTreeNodeContent isGliding renderProps={getRenderProps}>
                {getNode().value}
            </PageTreeNodeContent>
        )}
    />
);
