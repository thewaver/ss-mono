import { useState } from "react";

import { SplitPane } from "@thewaver/ss-components-react";
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
    const ratios = useState(STARTING_COMPARE);

    return (
        <PageSplitPaneCompareFrame>
            <SplitPane
                panes={COMPARE}
                ratios={ratios}
                ariaLabel={COMPARE_TWO_PICTURES_LABEL}
                renderPane={(_pane, index) => (
                    <PageSplitPaneCompareBox
                        side={index === 0 ? "start" : "end"}
                        src={PICTURES[index].src}
                        alt={PICTURES[index].alt}
                    />
                )}
                renderGutter={(flags) => <PageSplitPaneGutter flags={flags} orientation={"horizontal"} />}
            />
        </PageSplitPaneCompareFrame>
    );
};
