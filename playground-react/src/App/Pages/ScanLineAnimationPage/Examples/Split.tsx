import { useMemo } from "react";

import {
    CellAnimationBreakpointUtils,
    CellAnimationWeights,
    ScanlineAnimation,
    ScanlineAnimationKeyframes,
} from "@thewaver/ss-components-react";
import type { CellAnimationBreakpointOpts, ScanlineHorizontalSplitOpts } from "@thewaver/ss-components-react";
import type { Index2d } from "@thewaver/ss-utils";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps & {
    breakpointOpts: CellAnimationBreakpointOpts;
    keyframeOpts: ScanlineHorizontalSplitOpts;
};

export const SplitExample = ({ keyframeOpts, breakpointOpts, weightType, ...otherProps }: Props) => {
    const computeCellWeights = useMemo(
        () => (count: Index2d) => CellAnimationWeights.computeCellWeights(weightType, count, WEIGHT_ORIGIN),
        [weightType],
    );

    return (
        <ScanlineAnimation
            {...otherProps}
            computeCellWeights={computeCellWeights}
            computeScanlineAnimation={(defs, timeline) =>
                ScanlineAnimationKeyframes.computeHorizontalSplit(
                    CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, breakpointOpts),
                    defs,
                    timeline,
                    keyframeOpts,
                )
            }
        />
    );
};
