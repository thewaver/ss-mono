import { createMemo } from "solid-js";

import { RGBAnimation, RGBAnimationKeyframes, access } from "@thewaver/ss-components-solid";
import type { AccessorProps } from "@thewaver/ss-components-solid";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageSolid.types";

type Props = RGBAnimationExampleProps & AccessorProps<{ radiusPercent: number }>;

export const OrbitExample = (props: Props) => {
    const getAnimation = createMemo(() =>
        RGBAnimationKeyframes.createOrbit({ radiusPercent: access(props.radiusPercent) }),
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
            computeSliceAnimation={getAnimation()}
        />
    );
};
