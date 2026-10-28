import { useState } from "react";

import { RGBAnimation, RGB_ANIMATION_CHANNELS } from "@thewaver/ss-components-react";
import type { RGBAnimationChannel } from "@thewaver/ss-components-react";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageReact.types";

const FULL_TURN_DEGREES = 360;

const computeDirection = (channel: RGBAnimationChannel, anchor: RGBAnimationChannel) => {
    if (channel === anchor) return 0;

    return RGB_ANIMATION_CHANNELS.find((other) => other !== anchor) === channel ? 1 : -1;
};

type Props = RGBAnimationExampleProps & { turns: number };

export const HueSwapExample = (props: Props) => {
    const [pass, setPass] = useState(0);

    const anchor = RGB_ANIMATION_CHANNELS[pass % RGB_ANIMATION_CHANNELS.length];

    return (
        <RGBAnimation
            src={props.src}
            ariaLabel={props.ariaLabel}
            playback={props.playback}
            progress={props.progress}
            colorMixing={props.colorMixing}
            animationDurationMs={props.animationDurationMs}
            animationIterationDelayMs={props.animationIterationDelayMs}
            computeChannelAnimation={(defs, timeline) => ({
                "hue-rotate": computeDirection(defs.channel, anchor) * props.turns * FULL_TURN_DEGREES * timeline,
            })}
            onIterationEnd={() => {
                setPass((pass) => pass + 1);
            }}
        />
    );
};
