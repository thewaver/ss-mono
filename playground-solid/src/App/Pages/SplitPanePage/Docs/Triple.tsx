import { createSignal } from "solid-js";

import { SplitPane } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { STARTING_TRIPLE, TRIPLE } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
import { SplitPanePageUtils } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.utils";

import {
    PageSplitPaneBox,
    PageSplitPaneFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";

export const TripleDocsExample = () => {
    const ratios = createSignal(STARTING_TRIPLE);

    return (
        <>
            <PageSplitPaneFrame>
                <SplitPane
                    panes={TRIPLE}
                    ratios={ratios}
                    ariaLabel={"Three panes"}
                    renderPane={(_getPane, index) => <PageSplitPaneBox>Pane {index + 1}</PageSplitPaneBox>}
                    renderGutter={(getFlags) => <PageSplitPaneGutter flags={getFlags} orientation={"horizontal"} />}
                />
            </PageSplitPaneFrame>

            <div
                class={exampleStyles.exampleReadout}
                data-readout
            >{`Ratios: ${SplitPanePageUtils.toPercentText(ratios[0]())}`}</div>
        </>
    );
};
