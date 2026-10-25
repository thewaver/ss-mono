import { useState } from "react";

import { Tree } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { ASSETS } from "../TreePageReact.const";

export const RecordsDocsExample = () => {
    const valueState = useState<Asset | undefined>();

    return (
        <>
            <Tree
                renderHighlightFloater={renderPageHighlightFloater}
                nodes={ASSETS}
                value={valueState}
                ariaLabel={"Assets"}
                renderNode={(node, renderProps) => (
                    <PageTreeNodeContent isGliding renderProps={renderProps} detail={node.value.kind}>
                        {node.value.name}
                    </PageTreeNodeContent>
                )}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${JSON.stringify(valueState[0]) ?? "none"}`}
            </div>
        </>
    );
};
