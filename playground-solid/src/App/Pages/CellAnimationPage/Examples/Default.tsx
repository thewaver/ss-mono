import { createMemo } from "solid-js";

import {
    CellAnimation,
    CellAnimationBreakpointUtils,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlaybackUtils,
    CellAnimationWeights,
    access,
} from "@thewaver/ss-components-solid";

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
    const getOrigin = createMemo(() =>
        CellAnimationOrigins.computeOrigin(access(originType), access(otherProps.cellCount)),
    );

    return (
        <CellAnimation
            {...otherProps}
            animationDurationMs={() =>
                CellAnimationPlaybackUtils.computeCycleDurationMs(
                    access(otherProps.animationDurationMs),
                    access(playbackOpts),
                )
            }
            computeCellWeights={(count) =>
                CellAnimationWeights.computeCellWeights(access(weightType), count, getOrigin(), access(weightOpts))
            }
            computeCellAnimation={(defs, timeline) =>
                CellAnimationKeyframes.computeAnimation(
                    access(animationType),
                    CellAnimationBreakpointUtils.computeBreakpoints(
                        defs.weight,
                        CellAnimationPlaybackUtils.computeBreakpointOpts(
                            access(breakpointOpts),
                            timeline,
                            access(playbackOpts),
                        ),
                    ),
                    { ...defs, origin: getOrigin() },
                    CellAnimationPlaybackUtils.computeGlobalTimeline(
                        timeline,
                        access(otherProps.animationDurationMs),
                        access(playbackOpts),
                    ),
                    access(breakpointOpts).easing,
                )
            }
        />
    );
};
