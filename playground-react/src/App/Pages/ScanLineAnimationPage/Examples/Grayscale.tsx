import { useMemo } from "react";

import { ScanlineAnimation, ScanlineAnimationKeyframes, SliceAnimationWeights } from "@thewaver/ss-components-react";
import type { ScanlineHorizontalGrayscaleOpts, SliceAnimationBreakpointOpts } from "@thewaver/ss-components-react";
import type { Count2d } from "@thewaver/ss-utils";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps & {
    breakpointOpts: SliceAnimationBreakpointOpts;
    keyframeOpts: ScanlineHorizontalGrayscaleOpts;
};

export const GrayscaleExample = (props: Props) => {
    const { keyframeOpts, breakpointOpts, weightType, ...otherProps } = props;

    const computeSliceWeights = useMemo(
        () => (count: Count2d) => SliceAnimationWeights.computeSliceWeights(props.weightType, count, WEIGHT_ORIGIN),
        [props.weightType],
    );

    const animation = useMemo(
        () => ScanlineAnimationKeyframes.createHorizontalGrayscale(props.keyframeOpts),
        [props.keyframeOpts],
    );

    return (
        <ScanlineAnimation
            {...otherProps}
            computeSliceWeights={computeSliceWeights}
            breakpointOpts={props.breakpointOpts}
            computeSliceAnimation={animation}
        />
    );
};
