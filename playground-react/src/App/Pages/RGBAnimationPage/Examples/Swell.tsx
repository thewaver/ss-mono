import { RGBAnimation } from "@thewaver/ss-components-react";
import type { RGBAnimationChannel } from "@thewaver/ss-components-react";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageReact.types";

const SCALE_DIRECTIONS: Record<RGBAnimationChannel, number> = { red: 1, green: 0, blue: -1 };

const computeSwell = (timeline: number) => (1 - Math.cos(timeline * 2 * Math.PI)) * 0.5;

type Props = RGBAnimationExampleProps & { scalePercent: number };

export const SwellExample = (props: Props) => {
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
                const scale = 100 + SCALE_DIRECTIONS[defs.channel] * props.scalePercent * computeSwell(timeline);

                return { scale: [scale, scale] };
            }}
        />
    );
};
