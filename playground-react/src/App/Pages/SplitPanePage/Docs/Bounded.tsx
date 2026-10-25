import { useState } from "react";

import { SplitPane } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { BOUNDED, STARTING_BOUNDED } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
import { SplitPanePageUtils } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.utils";

import {
    PageSplitPaneBox,
    PageSplitPaneFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";

export const BoundedDocsExample = () => {
    const ratios = useState(STARTING_BOUNDED);

    return (
        <>
            <PageSplitPaneFrame>
                <SplitPane
                    panes={BOUNDED}
                    ratios={ratios}
                    ariaLabel={"Bounded panes"}
                    renderPane={(_pane, index) => (
                        <PageSplitPaneBox>{index === 0 ? "Sidebar 120–220px" : "Content min 160px"}</PageSplitPaneBox>
                    )}
                    renderGutter={(flags) => <PageSplitPaneGutter flags={flags} orientation={"horizontal"} />}
                />
            </PageSplitPaneFrame>

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Ratios: ${SplitPanePageUtils.toPercentText(ratios[0])}`}
            </div>
        </>
    );
};
