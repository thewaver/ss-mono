import { createSignal } from "solid-js";

import { SplitPane } from "@thewaver/ss-components-solid";
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
    const ratios = createSignal(STARTING_RIGHT_TO_LEFT);

    return (
        <>
            <div dir={"rtl"} class={styles.docsDirectionBox}>
                <PageSplitPaneFrame>
                    <SplitPane
                        panes={RIGHT_TO_LEFT}
                        ratios={ratios}
                        ariaLabel={"Two panes in a right-to-left box"}
                        renderPane={(_getPane, index) => (
                            <PageSplitPaneBox>{index === 0 ? "Navigation" : "Content"}</PageSplitPaneBox>
                        )}
                        renderGutter={(getFlags) => <PageSplitPaneGutter flags={getFlags} orientation={"horizontal"} />}
                    />
                </PageSplitPaneFrame>
            </div>

            <div
                class={exampleStyles.exampleReadout}
                data-readout
            >{`Ratios: ${SplitPanePageUtils.toPercentText(ratios[0]())}`}</div>
        </>
    );
};
