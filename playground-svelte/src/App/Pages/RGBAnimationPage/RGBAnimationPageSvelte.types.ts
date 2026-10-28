import type { BaseRGBAnimationExampleProps } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";

export type RGBAnimationExampleProps = BaseRGBAnimationExampleProps & {
    playback: boolean;
    progress: number;
};

export type RGBAnimationWrapperProps = RGBAnimationExampleProps & { boxWidth: number };
