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
    ScanlineHorizontalGrayscaleOpts,
} from "@thewaver/ss-components";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps &
    AccessorProps<{
        breakpointOpts: CellAnimationBreakpointOpts;
        keyframeOpts: ScanlineHorizontalGrayscaleOpts;
    }>;

export const BrightnessExample = ({ keyframeOpts, breakpointOpts, weightType, ...otherProps }: Props) => {
    return (
        <ScanlineAnimation
            {...otherProps}
            computeCellWeights={(count) =>
                CellAnimationWeights.computeCellWeights(access(weightType), count, WEIGHT_ORIGIN)
            }
            computeScanlineAnimation={(defs, timeline) =>
                ScanlineAnimationKeyframes.computeHorizontalBrightness(
                    CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, access(breakpointOpts)),
                    defs,
                    timeline,
                    access(keyframeOpts),
                )
            }
        />
    );
};
