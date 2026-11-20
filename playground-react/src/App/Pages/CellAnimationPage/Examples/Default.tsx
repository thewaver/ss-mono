import { useMemo } from "react";

import {
    CellAnimation,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    SliceAnimationWeights,
} from "@thewaver/ss-components-react";
import type { Count2d } from "@thewaver/ss-utils";

import type { CellAnimationSourcedExampleProps } from "../CellAnimationPage.types";

export const DefaultExample = (props: CellAnimationSourcedExampleProps) => {
    const { animationType, originType, weightType, weightOpts, ...otherProps } = props;

    const origin = useMemo(
        () => CellAnimationOrigins.computeOrigin(props.originType, otherProps.cellCount),
        [props.originType, otherProps.cellCount],
    );

    const computeSliceWeights = useMemo(
        () => (count: Count2d) =>
            SliceAnimationWeights.computeSliceWeights(props.weightType, count, origin, props.weightOpts),
        [props.weightType, origin, props.weightOpts],
    );

    return (
        <CellAnimation
            {...otherProps}
            origin={origin}
            computeSliceWeights={computeSliceWeights}
            computeSliceAnimation={CellAnimationKeyframes.SAMPLE_ANIMATIONS[props.animationType]}
        />
    );
};
