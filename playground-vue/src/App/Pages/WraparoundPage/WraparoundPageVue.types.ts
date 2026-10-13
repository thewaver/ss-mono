export type { WraparoundExampleProps } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.types";

export type WraparoundMarqueeExampleProps = {
    "driftPxPerSecond": number;
    "driftDegrees": number;
    "playback": boolean;
    "onUpdate:playback"?: (value: boolean) => void;
};
