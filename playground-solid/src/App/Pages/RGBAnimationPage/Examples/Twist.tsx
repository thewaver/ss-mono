import { RGBAnimation, access } from "@thewaver/ss-components-solid";
import type { AccessorProps, RGBAnimationChannel } from "@thewaver/ss-components-solid";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageSolid.types";

const DIRECTIONS: Record<RGBAnimationChannel, number> = { red: 1, green: 0, blue: -1 };

type Props = RGBAnimationExampleProps & AccessorProps<{ maxDegrees: number }>;

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
                rotate: DIRECTIONS[defs.channel] * access(props.maxDegrees) * Math.sin(timeline * Math.PI),
            })}
        />
    );
};
