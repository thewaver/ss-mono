import { createMemo } from "solid-js";

import {
    CellAnimation,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    SliceAnimationWeights,
    access,
} from "@thewaver/ss-components-solid";

import type { CellAnimationSourcedExampleProps } from "../CellAnimationPage.types";

export const DefaultExample = ({
    animationType,
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
            origin={getOrigin}
            computeSliceWeights={(count) =>
                SliceAnimationWeights.computeSliceWeights(access(weightType), count, getOrigin(), access(weightOpts))
            }
            computeSliceAnimation={CellAnimationKeyframes.SAMPLE_ANIMATIONS[access(animationType)]}
        />
    );
};
