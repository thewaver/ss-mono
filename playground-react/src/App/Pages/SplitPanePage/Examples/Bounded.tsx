import { SplitPane } from "@thewaver/ss-components-react";
import { BOUNDED } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import {
    PageSplitPaneBox,
    PageSplitPaneFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";
import type { SplitPaneExampleProps } from "../SplitPanePage.types";

type Props = SplitPaneExampleProps;

export const BoundedExample = (props: Props) => {
    return (
        <PageSplitPaneFrame>
            <SplitPane
                panes={BOUNDED}
                ratiosState={props.ratiosState}
                gutterSize={props.gutterSize}
                isDisabled={props.isDisabled}
                ariaLabel={"Bounded panes"}
                renderPane={(_pane, index) => (
                    <PageSplitPaneBox>{index === 0 ? "Sidebar 120–220px" : "Content min 160px"}</PageSplitPaneBox>
                )}
                renderGutter={(flags) => <PageSplitPaneGutter flags={flags} orientation={"horizontal"} />}
            />
        </PageSplitPaneFrame>
    );
};
