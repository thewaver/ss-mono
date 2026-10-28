import { createSignal } from "solid-js";

import { RGBAnimation, RGB_ANIMATION_CHANNELS, access } from "@thewaver/ss-components-solid";
import type { AccessorProps, RGBAnimationChannel } from "@thewaver/ss-components-solid";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageSolid.types";

const FULL_TURN_DEGREES = 360;

const computeDirection = (channel: RGBAnimationChannel, anchor: RGBAnimationChannel) => {
    if (channel === anchor) return 0;

    return RGB_ANIMATION_CHANNELS.find((other) => other !== anchor) === channel ? 1 : -1;
};

type Props = RGBAnimationExampleProps & AccessorProps<{ turns: number }>;

export const HueSwapExample = (props: Props) => {
    const [getPass, setPass] = createSignal(0);

    const getAnchor = () => RGB_ANIMATION_CHANNELS[getPass() % RGB_ANIMATION_CHANNELS.length];

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
                "hue-rotate":
                    computeDirection(defs.channel, getAnchor()) * access(props.turns) * FULL_TURN_DEGREES * timeline,
            })}
            onIterationEnd={() => {
                setPass((pass) => pass + 1);
            }}
        />
    );
};
