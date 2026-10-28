import { RGBAnimation, RGB_ANIMATION_CHANNELS, access } from "@thewaver/ss-components-solid";
import type { AccessorProps } from "@thewaver/ss-components-solid";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageSolid.types";

const LAG_SHARE = 0.1;
const TRAVEL_SHARE = 1 - LAG_SHARE * (RGB_ANIMATION_CHANNELS.length - 1);

const computePath = (timeline: number, distance: number) => {
    if (timeline <= 0 || timeline >= TRAVEL_SHARE) return [0, 0];

    const turn = (timeline / TRAVEL_SHARE) * 2 * Math.PI;

    return [distance * Math.sin(turn), distance * Math.sin(turn * 2) * 0.5];
};

type Props = RGBAnimationExampleProps & AccessorProps<{ distancePercent: number }>;

export const EchoExample = (props: Props) => {
    return (
        <RGBAnimation
            src={props.src}
            ariaLabel={props.ariaLabel}
            playback={props.playback}
            progress={props.progress}
            colorMixing={props.colorMixing}
            animationDurationMs={props.animationDurationMs}
            animationIterationDelayMs={props.animationIterationDelayMs}
            computeRootAnimation={(timeline) => ({ translate: computePath(timeline, access(props.distancePercent)) })}
            computeChannelAnimation={(defs, timeline) => {
                const lag = RGB_ANIMATION_CHANNELS.indexOf(defs.channel) * LAG_SHARE;
                const [rootX, rootY] = computePath(timeline, access(props.distancePercent));
                const [laggedX, laggedY] = computePath(timeline - lag, access(props.distancePercent));

                return { translate: [laggedX - rootX, laggedY - rootY] };
            }}
        />
    );
};
