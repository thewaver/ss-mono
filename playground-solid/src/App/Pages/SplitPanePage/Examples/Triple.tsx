import { SplitPane } from "@thewaver/ss-components-solid";
import { TRIPLE } from "@thewaver/ss-playground-core/App/Pages/SplitPanePage/SplitPanePage.const";

import {
    PageSplitPaneBox,
    PageSplitPaneFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";
import type { SplitPaneExampleProps } from "../SplitPanePage.types";

type Props = SplitPaneExampleProps;

export const TripleExample = (props: Props) => {
    return (
        <PageSplitPaneFrame>
            <SplitPane
                panes={() => TRIPLE}
                ratiosSignal={props.ratiosSignal}
                gutterSize={props.gutterSize}
                isDisabled={props.isDisabled}
                ariaLabel={"Three panes"}
                renderPane={(_getPane, index) => <PageSplitPaneBox>Pane {index + 1}</PageSplitPaneBox>}
                renderGutter={(getFlags) => <PageSplitPaneGutter flags={getFlags} orientation={"horizontal"} />}
            />
        </PageSplitPaneFrame>
    );
};
