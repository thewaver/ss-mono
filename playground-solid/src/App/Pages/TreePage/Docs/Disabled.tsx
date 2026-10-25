import { createMemo, createSignal } from "solid-js";

import { Tree, access } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { createFilesWithDisabled } from "../TreePageSolid.const";
import type { TreeDisabledDocsExampleProps } from "../TreePageSolid.types";

type Props = TreeDisabledDocsExampleProps;

export const DisabledDocsExample = (props: Props) => {
    const expandedSignal = createSignal<string[]>(["src", "Lib"]);

    const getNodes = createMemo(() => createFilesWithDisabled(access(props.isReachable)));

    return (
        <Tree
            renderHighlightFloater={renderPageHighlightFloater}
            nodes={getNodes}
            expanded={expandedSignal}
            ariaLabel={"Repository"}
            renderNode={(getNode, getRenderProps) => (
                <PageTreeNodeContent isGliding renderProps={getRenderProps}>
                    {getNode().value}
                </PageTreeNodeContent>
            )}
        />
    );
};
