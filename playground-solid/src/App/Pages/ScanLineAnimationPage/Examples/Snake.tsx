import { createMemo } from "solid-js";

import {
    ScanlineAnimation,
    ScanlineAnimationKeyframes,
    SliceAnimationWeights,
    access,
} from "@thewaver/ss-components-solid";
import type {
    AccessorProps,
    ScanlineHorizontalSnakeOpts,
    SliceAnimationBreakpointOpts,
} from "@thewaver/ss-components-solid";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps &
    AccessorProps<{
        breakpointOpts: SliceAnimationBreakpointOpts;
        keyframeOpts: ScanlineHorizontalSnakeOpts;
    }>;

export const SnakeExample = ({ keyframeOpts, breakpointOpts, weightType, ...otherProps }: Props) => {
    const getAnimation = createMemo(() => ScanlineAnimationKeyframes.createHorizontalSnake(access(keyframeOpts)));

    return (
        <ScanlineAnimation
            {...otherProps}
            computeSliceWeights={(count) =>
                SliceAnimationWeights.computeSliceWeights(access(weightType), count, WEIGHT_ORIGIN)
            }
            breakpointOpts={breakpointOpts}
            computeSliceAnimation={getAnimation()}
        />
    );
};
