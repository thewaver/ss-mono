import { useState } from "react";

import { Range } from "@thewaver/ss-components-react";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { RangeTooltipDocsExampleProps } from "../RangePageReact.types";

type Props = RangeTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueState = useState(75);

    return (
        <Range
            value={valueState}
            id={"tooltipVolume"}
            ariaLabel={"Disabled but reachable range"}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            thumbSize={RANGE_THUMB_SIZE}
            renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
            tooltipDefs={{
                placement: { x: "center", y: "top_out" },
                offset: { x: 0, y: 10 },
                renderContent: (visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        Focusable so this tooltip can be read, but arrow keys and dragging must leave the value where it
                        is.
                    </PageTooltipContent>
                ),
            }}
        />
    );
};
