import { createMemo } from "solid-js";

import { RGBAnimation, RGBAnimationKeyframes, access } from "@thewaver/ss-components-solid";
import type { AccessorProps } from "@thewaver/ss-components-solid";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageSolid.types";

type Props = RGBAnimationExampleProps & AccessorProps<{ distancePercent: number }>;

export const EchoExample = (props: Props) => {
    const getOpts = createMemo(() => ({ distancePercent: access(props.distancePercent) }));

    const getAnimation = createMemo(() => RGBAnimationKeyframes.createEcho(getOpts()));

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
                translate: RGBAnimationKeyframes.computeEchoRootPath(timeline, getOpts()),
            })}
            computeSliceAnimation={getAnimation()}
        />
    );
};
