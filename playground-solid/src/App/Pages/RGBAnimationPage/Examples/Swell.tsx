import { createMemo } from "solid-js";

import { RGBAnimation, RGBAnimationKeyframes, access } from "@thewaver/ss-components-solid";
import type { AccessorProps } from "@thewaver/ss-components-solid";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageSolid.types";

type Props = RGBAnimationExampleProps & AccessorProps<{ scalePercent: number }>;

export const SwellExample = (props: Props) => {
    const getAnimation = createMemo(() =>
        RGBAnimationKeyframes.createSwell({ scalePercent: access(props.scalePercent) }),
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
