import { createMemo } from "solid-js";

import {
    CellAnimation,
    CellAnimationBreakpoints,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationWeights,
    access,
} from "@thewaver/ss-components";

import type { CellAnimationSourcedExampleProps } from "../CellAnimationPage.types";

export const DefaultExample = ({
    animationType,
    breakpointOpts,
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
            computeCellWeights={(count) =>
                CellAnimationWeights.computeCellWeights(access(weightType), count, getOrigin(), access(weightOpts))
            }
            computeCellAnimation={(defs, timeline) =>
                CellAnimationKeyframes.computeAnimation(
                    access(animationType),
                    CellAnimationBreakpoints.computeBreakpoints(defs.weight, access(breakpointOpts)),
                    { ...defs, origin: getOrigin() },
                    timeline,
                    access(breakpointOpts).easing,
                )
            }
        />
    );
};
