import { useMemo } from "react";

import {
    CellAnimation,
    CellAnimationBreakpointUtils,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlaybackUtils,
    CellAnimationWeights,
} from "@thewaver/ss-components-react";

import type { CellAnimationSourcedExampleProps } from "../CellAnimationPage.types";

export const DefaultExample = ({
    animationType,
    breakpointOpts,
    playbackOpts,
    originType,
    weightType,
    weightOpts,
    ...otherProps
}: CellAnimationSourcedExampleProps) => {
    const origin = useMemo(
        () => CellAnimationOrigins.computeOrigin(originType, otherProps.cellCount),
        [originType, otherProps.cellCount],
    );

    return (
        <CellAnimation
            {...otherProps}
            animationDurationMs={CellAnimationPlaybackUtils.computeCycleDurationMs(
                otherProps.animationDurationMs,
                playbackOpts,
            )}
            computeCellWeights={(count) =>
                CellAnimationWeights.computeCellWeights(weightType, count, origin, weightOpts)
            }
            computeCellAnimation={(defs, timeline) =>
                CellAnimationKeyframes.computeAnimation(
                    animationType,
                    CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, breakpointOpts),
                    { ...defs, origin },
                    CellAnimationPlaybackUtils.computeGlobalTimeline(
                        timeline,
                        otherProps.animationDurationMs,
                        playbackOpts,
                    ),
                    breakpointOpts.easing,
                )
            }
        />
    );
};
