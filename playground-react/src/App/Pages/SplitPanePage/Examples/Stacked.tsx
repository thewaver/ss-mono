import { SplitPane } from "@thewaver/ss-components-react";
import { PAIR } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import {
    PageSplitPaneBox,
    PageSplitPaneFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";
import type { SplitPaneExampleProps } from "../SplitPanePage.types";

type Props = SplitPaneExampleProps;

export const StackedExample = (props: Props) => {
    return (
        <PageSplitPaneFrame>
            <SplitPane
                panes={PAIR}
                ratios={props.ratios}
                orientation={"vertical"}
                gutterSize={props.gutterSize}
                isDisabled={props.isDisabled}
                ariaLabel={"Stacked panes"}
                renderPane={(_pane, index) => <PageSplitPaneBox>{index === 0 ? "Top" : "Bottom"}</PageSplitPaneBox>}
                renderGutter={(flags) => <PageSplitPaneGutter flags={flags} orientation={"vertical"} />}
            />
        </PageSplitPaneFrame>
    );
};
