import { useState } from "react";

import { SplitPane } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { PAIR, STARTING_PAIR } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
import { SplitPanePageUtils } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.utils";

import {
    PageSplitPaneBox,
    PageSplitPaneFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";
import type { SplitPaneBasicDocsExampleProps } from "../SplitPanePageReact.types";

type Props = SplitPaneBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const ratios = useState(STARTING_PAIR);

    return (
        <>
            <PageSplitPaneFrame>
                <SplitPane
                    panes={PAIR}
                    ratios={ratios}
                    orientation={props.orientation}
                    gutterSize={props.gutterSize}
                    isDisabled={props.isDisabled}
                    ariaLabel={"Two panes"}
                    renderPane={(_pane, index) => (
                        <PageSplitPaneBox>{index === 0 ? "Navigation" : "Content"}</PageSplitPaneBox>
                    )}
                    renderGutter={(flags) => <PageSplitPaneGutter flags={flags} orientation={props.orientation} />}
                />
            </PageSplitPaneFrame>

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Ratios: ${SplitPanePageUtils.toPercentText(ratios[0])}`}
            </div>
        </>
    );
};
