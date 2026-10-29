import { RGBAnimation } from "@thewaver/ss-components-react";
import type { RGBAnimationChannel } from "@thewaver/ss-components-react";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageReact.types";

const DIRECTIONS: Record<RGBAnimationChannel, number> = { red: -1, green: 0, blue: 1 };

type Props = RGBAnimationExampleProps & { separationPercent: number };

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
            computeSliceAnimation={(defs, timeline) => ({
                translateX: DIRECTIONS[defs.channel] * props.separationPercent * Math.sin(timeline * Math.PI),
            })}
        />
    );
};
