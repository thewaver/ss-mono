import { SplitPane } from "@thewaver/ss-components-react";
import { COMPARE } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
import knight_date from "@thewaver/ss-playground/App/knight_date.webp";
import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";

import {
    PageSplitPaneCompareBox,
    PageSplitPaneCompareFrame,
    PageSplitPaneGutter,
} from "../../../StyledComponents/SplitPaneContent/SplitPaneContent";
import type { SplitPaneExampleProps } from "../SplitPanePage.types";

type Props = SplitPaneExampleProps;

const PICTURES = [
    { src: knight_profile, alt: "The knight in an office" },
    { src: knight_date, alt: "The knight at a candlelit table" },
];

export const CompareExample = (props: Props) => {
    return (
        <PageSplitPaneCompareFrame>
            <SplitPane
                panes={COMPARE}
                ratiosState={props.ratiosState}
                gutterSize={props.gutterSize}
                isDisabled={props.isDisabled}
                ariaLabel={"Compare two pictures"}
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
