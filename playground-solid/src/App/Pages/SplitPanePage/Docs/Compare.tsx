import { createSignal } from "solid-js";

import { SplitPane } from "@thewaver/ss-components-solid";
import {
    COMPARE,
    COMPARE_TWO_PICTURES_LABEL,
    PICTURES,
    STARTING_COMPARE,
} from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import {
    PageSplitPaneCompareBox,
    PageSplitPaneCompareFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";

export const CompareDocsExample = () => {
    const ratios = createSignal(STARTING_COMPARE);

    return (
        <PageSplitPaneCompareFrame>
            <SplitPane
                panes={COMPARE}
                ratios={ratios}
                ariaLabel={COMPARE_TWO_PICTURES_LABEL}
                renderPane={(_getPane, index) => (
                    <PageSplitPaneCompareBox
                        side={index === 0 ? "start" : "end"}
                        src={PICTURES[index].src}
                        alt={PICTURES[index].alt}
                    />
                )}
                renderGutter={(getFlags) => <PageSplitPaneGutter flags={getFlags} orientation={"horizontal"} />}
            />
        </PageSplitPaneCompareFrame>
    );
};
