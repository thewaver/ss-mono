import { createMemo } from "solid-js";

import {
    CellAnimation,
    CellAnimationBreakpoints,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlayback,
    CellAnimationWeights,
    access,
} from "@thewaver/ss-components";

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
                CellAnimationPlayback.computeCycleDurationMs(
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
                    CellAnimationBreakpoints.computeBreakpoints(defs.weight, access(breakpointOpts)),
                    { ...defs, origin: getOrigin() },
                    CellAnimationPlayback.computeGlobalTimeline(
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
