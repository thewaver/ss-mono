import { RGBAnimation } from "@thewaver/ss-components-react";
import type { RGBAnimationChannel } from "@thewaver/ss-components-react";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageReact.types";

const DIRECTIONS: Record<RGBAnimationChannel, number> = { red: 1, green: 0, blue: -1 };

type Props = RGBAnimationExampleProps & { maxDegrees: number };

export const TwistExample = (props: Props) => {
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
                rotate: DIRECTIONS[defs.channel] * props.maxDegrees * Math.sin(timeline * Math.PI),
            })}
        />
    );
};
