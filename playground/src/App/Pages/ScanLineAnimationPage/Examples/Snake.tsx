import {
    CellAnimationBreakpointUtils,
    CellAnimationWeights,
    ScanlineAnimation,
    ScanlineAnimationKeyframes,
    access,
} from "@thewaver/ss-components";
import type { AccessorProps, CellAnimationBreakpointOpts, ScanlineHorizontalSnakeOpts } from "@thewaver/ss-components";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps &
    AccessorProps<{
        breakpointOpts: CellAnimationBreakpointOpts;
        keyframeOpts: ScanlineHorizontalSnakeOpts;
    }>;

export const SnakeExample = ({ keyframeOpts, breakpointOpts, weightType, ...otherProps }: Props) => {
    return (
        <ScanlineAnimation
            {...otherProps}
            computeCellWeights={(count) =>
                CellAnimationWeights.computeCellWeights(access(weightType), count, WEIGHT_ORIGIN)
            }
            computeScanlineAnimation={(defs, timeline) =>
                ScanlineAnimationKeyframes.computeHorizontalSnake(
                    CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, access(breakpointOpts)),
                    defs,
                    timeline,
                    access(keyframeOpts),
                )
            }
        />
    );
};
