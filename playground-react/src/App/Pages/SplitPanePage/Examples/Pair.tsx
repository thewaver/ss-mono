import { SplitPane } from "@thewaver/ss-components-react";
import { PAIR } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import {
    PageSplitPaneBox,
    PageSplitPaneFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";
import type { SplitPaneExampleProps } from "../SplitPanePage.types";

type Props = SplitPaneExampleProps;

export const PairExample = (props: Props) => {
    return (
        <PageSplitPaneFrame>
            <SplitPane
                panes={PAIR}
                ratios={props.ratios}
                gutterSize={props.gutterSize}
                isDisabled={props.isDisabled}
                ariaLabel={"Two panes"}
                renderPane={(_pane, index) => (
                    <PageSplitPaneBox>{index === 0 ? "Navigation" : "Content"}</PageSplitPaneBox>
                )}
                renderGutter={(flags) => <PageSplitPaneGutter flags={flags} orientation={"horizontal"} />}
            />
        </PageSplitPaneFrame>
    );
};
