import { createMemo, splitProps } from "solid-js";

import {
    CellAnimation,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    SliceAnimationWeights,
    access,
} from "@thewaver/ss-components-solid";

import type { CellAnimationSourcedExampleProps } from "../CellAnimationPage.types";

export const DefaultExample = (props: CellAnimationSourcedExampleProps) => {
    const [, otherProps] = splitProps(props, ["animationType", "originType", "weightType", "weightOpts"]);

    const getOrigin = createMemo(() =>
        CellAnimationOrigins.computeOrigin(access(props.originType), access(otherProps.cellCount)),
    );

    return (
        <CellAnimation
            {...otherProps}
            origin={getOrigin}
            computeSliceWeights={(count) =>
                SliceAnimationWeights.computeSliceWeights(
                    access(props.weightType),
                    count,
                    getOrigin(),
                    access(props.weightOpts),
                )
            }
            computeSliceAnimation={CellAnimationKeyframes.SAMPLE_ANIMATIONS[access(props.animationType)]}
        />
    );
};
