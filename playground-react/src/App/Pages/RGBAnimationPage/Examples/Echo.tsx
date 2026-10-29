import { useMemo } from "react";

import { RGBAnimation, RGBAnimationKeyframes } from "@thewaver/ss-components-react";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageReact.types";

type Props = RGBAnimationExampleProps & { distancePercent: number };

export const EchoExample = (props: Props) => {
    const opts = useMemo(() => ({ distancePercent: props.distancePercent }), [props.distancePercent]);

    const animation = useMemo(() => RGBAnimationKeyframes.createEcho(opts), [opts]);

    return (
        <RGBAnimation
            src={props.src}
            ariaLabel={props.ariaLabel}
            playback={props.playback}
            progress={props.progress}
            colorMixing={props.colorMixing}
            animationDurationMs={props.animationDurationMs}
            animationIterationDelayMs={props.animationIterationDelayMs}
            computeRootAnimation={(timeline) => ({
                translate: RGBAnimationKeyframes.computeEchoRootPath(timeline, opts),
            })}
            computeSliceAnimation={animation}
        />
    );
};
