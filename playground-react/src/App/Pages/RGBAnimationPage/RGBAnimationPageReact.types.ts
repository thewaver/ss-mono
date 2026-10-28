import type { BaseRGBAnimationExampleProps } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";

export type RGBAnimationExampleProps = BaseRGBAnimationExampleProps & {
    playback: readonly [boolean, (value: boolean) => void];
    progress: readonly [number, (value: number) => void];
};
