import { useMemo } from "react";

import { ScanlineAnimation, ScanlineAnimationKeyframes, SliceAnimationWeights } from "@thewaver/ss-components-react";
import type { ScanlineHorizontalGrayscaleOpts, SliceAnimationBreakpointOpts } from "@thewaver/ss-components-react";
import type { Index2d } from "@thewaver/ss-utils";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps & {
    breakpointOpts: SliceAnimationBreakpointOpts;
    keyframeOpts: ScanlineHorizontalGrayscaleOpts;
};

export const BrightnessExample = ({ keyframeOpts, breakpointOpts, weightType, ...otherProps }: Props) => {
    const computeSliceWeights = useMemo(
        () => (count: Index2d) => SliceAnimationWeights.computeSliceWeights(weightType, count, WEIGHT_ORIGIN),
        [weightType],
    );

    const animation = useMemo(
        () => ScanlineAnimationKeyframes.createHorizontalBrightness(keyframeOpts),
        [keyframeOpts],
    );

    return (
        <ScanlineAnimation
            {...otherProps}
            computeSliceWeights={computeSliceWeights}
            breakpointOpts={breakpointOpts}
            computeSliceAnimation={animation}
        />
    );
};
