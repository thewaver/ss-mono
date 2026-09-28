import { SplitPane } from "@thewaver/ss-components-react";
import { CRAMPED } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import {
    PageSplitPaneBox,
    PageSplitPaneFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";
import type { SplitPaneExampleProps } from "../SplitPanePage.types";

const CRAMPED_WIDTH = 600;

type Props = SplitPaneExampleProps;

export const CrampedExample = (props: Props) => {
    return (
        <div style={{ width: `${CRAMPED_WIDTH}px`, overflowX: "auto" }}>
            <PageSplitPaneFrame>
                <SplitPane
                    panes={CRAMPED}
                    ratiosState={props.ratiosState}
                    gutterSize={props.gutterSize}
                    isDisabled={props.isDisabled}
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
