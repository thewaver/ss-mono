import { SplitPane } from "@thewaver/ss-components";

import {
    PageSplitPaneBox,
    PageSplitPaneFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";
import { RIGHT_TO_LEFT } from "../SplitPanePage.const";
import type { SplitPaneExampleProps } from "../SplitPanePage.types";

type Props = SplitPaneExampleProps;

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <PageSplitPaneFrame>
                <SplitPane
                    panes={() => RIGHT_TO_LEFT}
                    ratiosSignal={props.ratiosSignal}
                    gutterSize={props.gutterSize}
                    isDisabled={props.isDisabled}
                    ariaLabel={"Two panes in a right-to-left box"}
                    renderPane={(_getPane, index) => (
                        <PageSplitPaneBox>{index === 0 ? "Navigation" : "Content"}</PageSplitPaneBox>
                    )}
                    renderGutter={(getFlags) => <PageSplitPaneGutter flags={getFlags} orientation={"horizontal"} />}
                />
            </PageSplitPaneFrame>
        </div>
    );
};
