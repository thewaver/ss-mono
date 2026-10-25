import { useState } from "react";

import { SplitPane } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { STARTING_TRIPLE, TRIPLE } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
import { SplitPanePageUtils } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.utils";

import {
    PageSplitPaneBox,
    PageSplitPaneFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";

export const TripleDocsExample = () => {
    const ratios = useState(STARTING_TRIPLE);

    return (
        <>
            <PageSplitPaneFrame>
                <SplitPane
                    panes={TRIPLE}
                    ratios={ratios}
                    ariaLabel={"Three panes"}
                    renderPane={(_pane, index) => <PageSplitPaneBox>Pane {index + 1}</PageSplitPaneBox>}
                    renderGutter={(flags) => <PageSplitPaneGutter flags={flags} orientation={"horizontal"} />}
                />
            </PageSplitPaneFrame>

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Ratios: ${SplitPanePageUtils.toPercentText(ratios[0])}`}
            </div>
        </>
    );
};
