import {
    CellAnimationBreakpointUtils,
    CellAnimationWeights,
    ScanlineAnimation,
    ScanlineAnimationKeyframes,
    access,
} from "@thewaver/ss-components";
import type { AccessorProps, CellAnimationBreakpointOpts, _ScanlineHorizontalWaveOpts } from "@thewaver/ss-components";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps &
    AccessorProps<{
        breakpointOpts: CellAnimationBreakpointOpts;
        keyframeOpts: _ScanlineHorizontalWaveOpts;
    }>;

export const WaveExample = ({ keyframeOpts, breakpointOpts, weightType, ...otherProps }: Props) => {
    return (
        <ScanlineAnimation
            {...otherProps}
            computeCellWeights={(count) =>
                CellAnimationWeights.computeCellWeights(access(weightType), count, WEIGHT_ORIGIN)
            }
            computeScanlineAnimation={(defs, timeline) =>
                ScanlineAnimationKeyframes._computeHorizontalWave(
                    CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, access(breakpointOpts)),
                    defs,
                    timeline,
                    access(keyframeOpts),
                )
            }
        />
    );
};
