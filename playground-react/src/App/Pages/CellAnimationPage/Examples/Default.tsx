import { useMemo } from "react";

import {
    CellAnimation,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    SliceAnimationWeights,
} from "@thewaver/ss-components-react";
import type { Index2d } from "@thewaver/ss-utils";

import type { CellAnimationSourcedExampleProps } from "../CellAnimationPage.types";

export const DefaultExample = ({
    animationType,
    originType,
    weightType,
    weightOpts,
    ...otherProps
}: CellAnimationSourcedExampleProps) => {
    const origin = useMemo(
        () => CellAnimationOrigins.computeOrigin(originType, otherProps.cellCount),
        [originType, otherProps.cellCount],
    );

    const computeSliceWeights = useMemo(
        () => (count: Index2d) => SliceAnimationWeights.computeSliceWeights(weightType, count, origin, weightOpts),
        [weightType, origin, weightOpts],
    );

    return (
        <CellAnimation
            {...otherProps}
            origin={origin}
            computeSliceWeights={computeSliceWeights}
            computeSliceAnimation={CellAnimationKeyframes.SAMPLE_ANIMATIONS[animationType]}
        />
    );
};
