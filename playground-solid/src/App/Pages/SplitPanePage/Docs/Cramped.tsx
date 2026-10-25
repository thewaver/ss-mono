import { createSignal } from "solid-js";

import { SplitPane } from "@thewaver/ss-components-solid";
import { CRAMPED, STARTING_CRAMPED } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import {
    PageSplitPaneBox,
    PageSplitPaneFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";

const CRAMPED_WIDTH = 600;

export const CrampedDocsExample = () => {
    const ratios = createSignal(STARTING_CRAMPED);

    return (
        <div style={{ "width": `${CRAMPED_WIDTH}px`, "max-width": "100%", "overflow-x": "auto" }}>
            <PageSplitPaneFrame>
                <SplitPane
                    panes={CRAMPED}
                    ratios={ratios}
                    ariaLabel={"Cramped panes"}
                    renderPane={(_getPane, index) => (
                        <PageSplitPaneBox>{index === 0 ? "min 250px" : "min 400px"}</PageSplitPaneBox>
                    )}
                    renderGutter={(getFlags) => <PageSplitPaneGutter flags={getFlags} orientation={"horizontal"} />}
                />
            </PageSplitPaneFrame>
        </div>
    );
};
