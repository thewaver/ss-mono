import { createMemo, splitProps } from "solid-js";

import {
    ScanlineAnimation,
    ScanlineAnimationKeyframes,
    SliceAnimationWeights,
    access,
} from "@thewaver/ss-components-solid";
import type {
    AccessorProps,
    ScanlineHorizontalDropoutOpts,
    SliceAnimationBreakpointOpts,
} from "@thewaver/ss-components-solid";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps &
    AccessorProps<{
        breakpointOpts: SliceAnimationBreakpointOpts;
        keyframeOpts: ScanlineHorizontalDropoutOpts;
    }>;

export const DropoutExample = (props: Props) => {
    const [, otherProps] = splitProps(props, ["keyframeOpts", "breakpointOpts", "weightType"]);

    const getAnimation = createMemo(() =>
        ScanlineAnimationKeyframes.createHorizontalDropout(access(props.keyframeOpts)),
    );

    return (
        <ScanlineAnimation
            {...otherProps}
            computeSliceWeights={(count) =>
                SliceAnimationWeights.computeSliceWeights(access(props.weightType), count, WEIGHT_ORIGIN)
            }
            breakpointOpts={props.breakpointOpts}
            computeSliceAnimation={getAnimation()}
        />
    );
};
