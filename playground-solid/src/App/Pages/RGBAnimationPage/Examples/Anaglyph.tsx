import { RGBAnimation, access } from "@thewaver/ss-components-solid";
import type { AccessorProps, RGBAnimationChannel } from "@thewaver/ss-components-solid";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageSolid.types";

const DIRECTIONS: Record<RGBAnimationChannel, number> = { red: -1, green: 0, blue: 1 };

type Props = RGBAnimationExampleProps & AccessorProps<{ separationPercent: number }>;

export const AnaglyphExample = (props: Props) => {
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
                translateX: DIRECTIONS[defs.channel] * access(props.separationPercent) * Math.sin(timeline * Math.PI),
            })}
        />
    );
};
