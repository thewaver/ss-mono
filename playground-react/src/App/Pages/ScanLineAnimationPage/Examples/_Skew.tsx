import { useMemo } from "react";

import {
    CellAnimationBreakpointUtils,
    CellAnimationWeights,
    ScanlineAnimation,
    ScanlineAnimationKeyframes,
} from "@thewaver/ss-components-react";
import type { CellAnimationBreakpointOpts, _ScanlineHorizontalSkewOpts } from "@thewaver/ss-components-react";
import type { Index2d } from "@thewaver/ss-utils";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps & {
    breakpointOpts: CellAnimationBreakpointOpts;
    keyframeOpts: _ScanlineHorizontalSkewOpts;
};

export const SkewExample = ({ keyframeOpts, breakpointOpts, weightType, ...otherProps }: Props) => {
    const computeCellWeights = useMemo(
        () => (count: Index2d) => CellAnimationWeights.computeCellWeights(weightType, count, WEIGHT_ORIGIN),
        [weightType],
    );

    return (
        <ScanlineAnimation
            {...otherProps}
            computeCellWeights={computeCellWeights}
            computeScanlineAnimation={(defs, timeline) =>
                ScanlineAnimationKeyframes._computeHorizontalSkew(
                    CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, breakpointOpts),
                    defs,
                    timeline,
                    keyframeOpts,
                )
            }
        />
    );
};
