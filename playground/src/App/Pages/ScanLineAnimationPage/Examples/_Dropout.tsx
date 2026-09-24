import {
    CellAnimationBreakpointUtils,
    CellAnimationWeights,
    ScanlineAnimation,
    ScanlineAnimationKeyframes,
    access,
} from "@thewaver/ss-components";
import type {
    AccessorProps,
    CellAnimationBreakpointOpts,
    _ScanlineHorizontalDropoutOpts,
} from "@thewaver/ss-components";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps &
    AccessorProps<{
        breakpointOpts: CellAnimationBreakpointOpts;
        keyframeOpts: _ScanlineHorizontalDropoutOpts;
    }>;

export const DropoutExample = ({ keyframeOpts, breakpointOpts, weightType, ...otherProps }: Props) => {
    return (
        <ScanlineAnimation
            {...otherProps}
            computeCellWeights={(count) =>
                CellAnimationWeights.computeCellWeights(access(weightType), count, WEIGHT_ORIGIN)
            }
            computeScanlineAnimation={(defs, timeline) =>
                ScanlineAnimationKeyframes._computeHorizontalDropout(
                    CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, access(breakpointOpts)),
                    defs,
                    timeline,
                    access(keyframeOpts),
                )
            }
        />
    );
};
