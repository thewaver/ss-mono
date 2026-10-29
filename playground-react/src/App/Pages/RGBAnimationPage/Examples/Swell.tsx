import { useMemo } from "react";

import { RGBAnimation, RGBAnimationKeyframes } from "@thewaver/ss-components-react";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageReact.types";

type Props = RGBAnimationExampleProps & { scalePercent: number };

export const SwellExample = (props: Props) => {
    const animation = useMemo(
        () => RGBAnimationKeyframes.createSwell({ scalePercent: props.scalePercent }),
        [props.scalePercent],
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
