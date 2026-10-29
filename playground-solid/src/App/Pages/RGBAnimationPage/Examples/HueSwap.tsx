import { createMemo, createSignal } from "solid-js";

import { RGBAnimation, RGBAnimationKeyframes, RGB_ANIMATION_CHANNELS, access } from "@thewaver/ss-components-solid";
import type { AccessorProps } from "@thewaver/ss-components-solid";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageSolid.types";

type Props = RGBAnimationExampleProps & AccessorProps<{ turns: number }>;

export const HueSwapExample = (props: Props) => {
    const [getPass, setPass] = createSignal(0);

    const getAnimation = createMemo(() =>
        RGBAnimationKeyframes.createHueSwap({
            turns: access(props.turns),
            anchor: RGB_ANIMATION_CHANNELS[getPass() % RGB_ANIMATION_CHANNELS.length],
        }),
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
            onIterationEnd={() => {
                setPass((pass) => pass + 1);
            }}
        />
    );
};
