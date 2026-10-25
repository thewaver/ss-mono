import { createSignal } from "solid-js";

import { Range } from "@thewaver/ss-components-solid";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { RangeTooltipDocsExampleProps } from "../RangePageSolid.types";

type Props = RangeTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueSignal = createSignal(75);

    return (
        <Range
            value={valueSignal}
            id={"tooltipVolume"}
            ariaLabel={"Disabled but reachable range"}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            thumbSize={RANGE_THUMB_SIZE}
            renderContent={(getRenderProps) => <PageRangeContent renderProps={getRenderProps} />}
            tooltipDefs={() => ({
                placement: () => ({ x: "center", y: "top_out" }),
                offset: () => ({ x: 0, y: 10 }),
                renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        Focusable so this tooltip can be read, but arrow keys and dragging must leave the value where it
                        is.
                    </PageTooltipContent>
                ),
            })}
        />
    );
};
