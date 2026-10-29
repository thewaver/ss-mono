import { useMemo } from "react";

import { RGBAnimation, RGBAnimationKeyframes } from "@thewaver/ss-components-react";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageReact.types";

type Props = RGBAnimationExampleProps & { maxDegrees: number };

export const TiltExample = (props: Props) => {
    const animation = useMemo(
        () => RGBAnimationKeyframes.createTilt({ maxDegrees: props.maxDegrees }),
        [props.maxDegrees],
    );

    return (
        <RGBAnimation
            src={props.src}
            ariaLabel={props.ariaLabel}
            playback={props.playback}
            progress={props.progress}
            colorMixing={props.colorMixing}
            animationDurationMs={props.animationDurationMs}
            animationIterationDelayMs={props.animationIterationDelayMs}
            computeSliceAnimation={animation}
        />
    );
};
