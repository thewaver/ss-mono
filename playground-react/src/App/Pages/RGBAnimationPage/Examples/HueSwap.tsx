import { useMemo, useState } from "react";

import { RGBAnimation, RGBAnimationKeyframes, RGB_ANIMATION_CHANNELS } from "@thewaver/ss-components-react";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageReact.types";

type Props = RGBAnimationExampleProps & { turns: number };

export const HueSwapExample = (props: Props) => {
    const [pass, setPass] = useState(0);

    const animation = useMemo(
        () =>
            RGBAnimationKeyframes.createHueSwap({
                turns: props.turns,
                anchor: RGB_ANIMATION_CHANNELS[pass % RGB_ANIMATION_CHANNELS.length],
            }),
        [props.turns, pass],
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
            onIterationEnd={() => {
                setPass((pass) => pass + 1);
            }}
        />
    );
};
