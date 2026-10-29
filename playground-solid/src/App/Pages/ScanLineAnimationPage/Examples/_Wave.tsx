import { createMemo } from "solid-js";

import {
    CellAnimationBreakpointUtils,
    CellAnimationKeyframeUtils,
    CellAnimationWeights,
    ScanlineAnimation,
    ScanlineAnimationKeyframes,
    access,
} from "@thewaver/ss-components-solid";
import type {
    AccessorProps,
    CellAnimationBreakpointOpts,
    _ScanlineHorizontalWaveOpts,
} from "@thewaver/ss-components-solid";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps &
    AccessorProps<{
        breakpointOpts: CellAnimationBreakpointOpts;
        keyframeOpts: _ScanlineHorizontalWaveOpts;
    }>;

export const WaveExample = ({ keyframeOpts, breakpointOpts, weightType, ...otherProps }: Props) => {
    const getAnimation = createMemo(() => ScanlineAnimationKeyframes._createHorizontalWave(access(keyframeOpts)));

    return (
        <ScanlineAnimation
            {...otherProps}
            computeCellWeights={(count) =>
                CellAnimationWeights.computeCellWeights(access(weightType), count, WEIGHT_ORIGIN)
            }
            computeSliceAnimation={(defs, timeline) =>
                CellAnimationKeyframeUtils.computeAnimation(
                    getAnimation(),
                    CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, access(breakpointOpts)),
                    { ...defs, origin: WEIGHT_ORIGIN },
                    timeline,
                    access(breakpointOpts).easing,
                )
            }
        />
    );
};
