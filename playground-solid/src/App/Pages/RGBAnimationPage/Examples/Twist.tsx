import { createMemo } from "solid-js";

import { RGBAnimation, RGBAnimationKeyframes, RGBAnimationUtils, access } from "@thewaver/ss-components-solid";
import type { AccessorProps } from "@thewaver/ss-components-solid";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageSolid.types";

type Props = RGBAnimationExampleProps & AccessorProps<{ maxDegrees: number }>;

export const TwistExample = (props: Props) => {
    const getAnimation = createMemo(() => RGBAnimationKeyframes.createTwist({ maxDegrees: access(props.maxDegrees) }));

    return (
        <RGBAnimation
            src={props.src}
            ariaLabel={props.ariaLabel}
            playback={props.playback}
            progress={props.progress}
            colorMixing={props.colorMixing}
            animationDurationMs={props.animationDurationMs}
            animationIterationDelayMs={props.animationIterationDelayMs}
            computeSliceAnimation={(defs, timeline) => getAnimation()(timeline, RGBAnimationUtils.toSliceDefs(defs))}
        />
    );
};
