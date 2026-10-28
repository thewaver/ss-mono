import { RGBAnimation, RGB_ANIMATION_CHANNELS, access } from "@thewaver/ss-components-solid";
import type { AccessorProps } from "@thewaver/ss-components-solid";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageSolid.types";

type Props = RGBAnimationExampleProps & AccessorProps<{ radiusPercent: number }>;

export const OrbitExample = (props: Props) => {
    return (
        <RGBAnimation
            src={props.src}
            ariaLabel={props.ariaLabel}
            playback={props.playback}
            progress={props.progress}
            colorMixing={props.colorMixing}
            animationDurationMs={props.animationDurationMs}
            animationIterationDelayMs={props.animationIterationDelayMs}
            computeChannelAnimation={(defs, timeline) => {
                const index = RGB_ANIMATION_CHANNELS.indexOf(defs.channel);
                const angle = (timeline + index / RGB_ANIMATION_CHANNELS.length) * 2 * Math.PI;
                const radius = access(props.radiusPercent) * Math.sin(timeline * Math.PI);

                return { translate: [radius * Math.cos(angle), radius * Math.sin(angle)] };
            }}
        />
    );
};
