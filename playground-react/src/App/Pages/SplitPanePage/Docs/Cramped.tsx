import { useState } from "react";

import { SplitPane } from "@thewaver/ss-components-react";
import { CRAMPED, STARTING_CRAMPED } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import {
    PageSplitPaneBox,
    PageSplitPaneFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";

const CRAMPED_WIDTH = 600;

export const CrampedDocsExample = () => {
    const ratios = useState(STARTING_CRAMPED);

    return (
        <div style={{ width: `${CRAMPED_WIDTH}px`, maxWidth: "100%", overflowX: "auto" }}>
            <PageSplitPaneFrame>
                <SplitPane
                    panes={CRAMPED}
                    ratios={ratios}
                    ariaLabel={"Cramped panes"}
                    renderPane={(_pane, index) => (
                        <PageSplitPaneBox>{index === 0 ? "min 250px" : "min 400px"}</PageSplitPaneBox>
                    )}
                    renderGutter={(flags) => <PageSplitPaneGutter flags={flags} orientation={"horizontal"} />}
                />
            </PageSplitPaneFrame>
        </div>
    );
};
