import { useState } from "react";

import { SplitPane } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    RIGHT_TO_LEFT,
    STARTING_RIGHT_TO_LEFT,
} from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.css";
import { SplitPanePageUtils } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.utils";

import {
    PageSplitPaneBox,
    PageSplitPaneFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";

export const RightToLeftDocsExample = () => {
    const ratios = useState(STARTING_RIGHT_TO_LEFT);

    return (
        <>
            <div dir={"rtl"} className={styles.docsDirectionBox}>
                <PageSplitPaneFrame>
                    <SplitPane
                        panes={RIGHT_TO_LEFT}
                        ratios={ratios}
                        ariaLabel={"Two panes in a right-to-left box"}
                        renderPane={(_pane, index) => (
                            <PageSplitPaneBox>{index === 0 ? "Navigation" : "Content"}</PageSplitPaneBox>
                        )}
                        renderGutter={(flags) => <PageSplitPaneGutter flags={flags} orientation={"horizontal"} />}
                    />
                </PageSplitPaneFrame>
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Ratios: ${SplitPanePageUtils.toPercentText(ratios[0])}`}
            </div>
        </>
    );
};
