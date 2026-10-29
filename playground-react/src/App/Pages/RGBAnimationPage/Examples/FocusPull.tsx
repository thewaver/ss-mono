import { RGBAnimation, RGB_ANIMATION_CHANNELS } from "@thewaver/ss-components-react";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageReact.types";

const WINDOW_SHARE = 0.5;
const STAGGER_SHARE = 0.25;

const computeBump = (share: number) => (share <= 0 || share >= 1 ? 0 : (1 - Math.cos(share * 2 * Math.PI)) * 0.5);

type Props = RGBAnimationExampleProps & { maxBlurPx: number };

export const FocusPullExample = (props: Props) => {
    return (
        <RGBAnimation
            src={props.src}
            ariaLabel={props.ariaLabel}
            playback={props.playback}
            progress={props.progress}
            colorMixing={props.colorMixing}
            animationDurationMs={props.animationDurationMs}
            animationIterationDelayMs={props.animationIterationDelayMs}
            computeSliceAnimation={(defs, timeline) => {
                const index = RGB_ANIMATION_CHANNELS.indexOf(defs.channel);
                const share = (timeline - index * STAGGER_SHARE) / WINDOW_SHARE;

                return { blur: props.maxBlurPx * computeBump(share) };
            }}
        />
    );
};
