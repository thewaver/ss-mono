import { RGBAnimation } from "@thewaver/ss-components-react";
import type { RGBAnimationChannel } from "@thewaver/ss-components-react";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageReact.types";

const DIRECTIONS: Record<RGBAnimationChannel, number> = { red: 1, green: 0, blue: -1 };
const PERSPECTIVE_PX = 600;

type Props = RGBAnimationExampleProps & { maxDegrees: number };

export const TiltExample = (props: Props) => {
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
                perspective: PERSPECTIVE_PX,
                rotateY: DIRECTIONS[defs.channel] * props.maxDegrees * Math.sin(timeline * 2 * Math.PI),
            })}
        />
    );
};
