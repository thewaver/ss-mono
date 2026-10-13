export type { WraparoundExampleProps } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.types";

export type WraparoundMarqueeExampleProps = {
    driftPxPerSecond: number;
    driftDegrees: number;
    playback: readonly [boolean, (value: boolean) => void];
};
