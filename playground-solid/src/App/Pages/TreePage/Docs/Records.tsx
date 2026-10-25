import { createSignal } from "solid-js";

import { Tree } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { ASSETS } from "../TreePageSolid.const";

export const RecordsDocsExample = () => {
    const valueSignal = createSignal<Asset | undefined>();

    return (
        <>
            <Tree
                renderHighlightFloater={renderPageHighlightFloater}
                nodes={ASSETS}
                value={valueSignal}
                ariaLabel={"Assets"}
                renderNode={(getNode, getRenderProps) => (
                    <PageTreeNodeContent isGliding renderProps={getRenderProps} detail={() => getNode().value.kind}>
                        {getNode().value.name}
                    </PageTreeNodeContent>
                )}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: ${JSON.stringify(valueSignal[0]()) ?? "none"}`}
            </div>
        </>
    );
};
