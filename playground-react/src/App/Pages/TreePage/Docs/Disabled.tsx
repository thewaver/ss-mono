import { useMemo, useState } from "react";

import { Tree } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { createFilesWithDisabled } from "../TreePageReact.const";
import type { TreeDisabledDocsExampleProps } from "../TreePageReact.types";

type Props = TreeDisabledDocsExampleProps;

export const DisabledDocsExample = (props: Props) => {
    const expandedState = useState<string[]>(["src", "Lib"]);

    const nodes = useMemo(() => createFilesWithDisabled(props.isReachable), [props.isReachable]);

    return (
        <Tree
            renderHighlightFloater={renderPageHighlightFloater}
            nodes={nodes}
            expanded={expandedState}
            ariaLabel={"Repository"}
            renderNode={(node, renderProps) => (
                <PageTreeNodeContent isGliding renderProps={renderProps}>
                    {node.value}
                </PageTreeNodeContent>
            )}
        />
    );
};
