import { Range } from "@thewaver/ss-components-react";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { RangeExampleProps } from "../RangePage.types";

type Props = RangeExampleProps;

export const ReachableExample = (props: Props) => (
    <Range
        value={props.value}
        ariaLabel={"Disabled but reachable range"}
        isDisabled={true}
        isReachableWhenDisabled={true}
        thumbSize={RANGE_THUMB_SIZE}
        renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
        tooltipDefs={{
            placement: { x: "center", y: "top-out" },
            offset: { x: 0, y: 10 },
            renderContent: (visibilityTarget, transitionDurationMs) => (
                <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    Focusable so this tooltip can be read, but arrow keys and dragging must leave the value where it is.
                </PageTooltipContent>
            ),
        }}
    />
);
