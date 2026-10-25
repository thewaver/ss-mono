import { createSignal } from "solid-js";

import { SplitPane } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { BOUNDED, STARTING_BOUNDED } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
import { SplitPanePageUtils } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.utils";

import {
    PageSplitPaneBox,
    PageSplitPaneFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";

export const BoundedDocsExample = () => {
    const ratios = createSignal(STARTING_BOUNDED);

    return (
        <>
            <PageSplitPaneFrame>
                <SplitPane
                    panes={BOUNDED}
                    ratios={ratios}
                    ariaLabel={"Bounded panes"}
                    renderPane={(_getPane, index) => (
                        <PageSplitPaneBox>{index === 0 ? "Sidebar 120–220px" : "Content min 160px"}</PageSplitPaneBox>
                    )}
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
