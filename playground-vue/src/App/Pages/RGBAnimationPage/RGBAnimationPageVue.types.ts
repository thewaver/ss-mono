import type { BaseRGBAnimationExampleProps } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";

export type RGBAnimationExampleProps = BaseRGBAnimationExampleProps & {
    "playback": boolean;
    "onUpdate:playback"?: (isPlaying: boolean) => void;
    "progress": number;
    "onUpdate:progress"?: (progress: number) => void;
};

export type RGBAnimationWrapperProps = RGBAnimationExampleProps & { boxWidth: number; isPagePlaying: boolean };
