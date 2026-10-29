import { useMemo } from "react";

import { ScanlineAnimation, ScanlineAnimationKeyframes, SliceAnimationWeights } from "@thewaver/ss-components-react";
import type { SliceAnimationBreakpointOpts, _ScanlineHorizontalInterlaceOpts } from "@thewaver/ss-components-react";
import type { Index2d } from "@thewaver/ss-utils";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps & {
    breakpointOpts: SliceAnimationBreakpointOpts;
    keyframeOpts: _ScanlineHorizontalInterlaceOpts;
};

export const InterlaceExample = ({ keyframeOpts, breakpointOpts, weightType, ...otherProps }: Props) => {
    const computeSliceWeights = useMemo(
        () => (count: Index2d) => SliceAnimationWeights.computeSliceWeights(weightType, count, WEIGHT_ORIGIN),
        [weightType],
    );

    const animation = useMemo(
        () => ScanlineAnimationKeyframes._createHorizontalInterlace(keyframeOpts),
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
