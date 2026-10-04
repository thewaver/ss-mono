export type WraparoundExampleProps = {
    onPress: (name: string) => void;
};

export type WraparoundMarqueeExampleProps = {
    "driftPxPerSecond": number;
    "driftDegrees": number;
    "playback": boolean;
    "onUpdate:playback"?: (value: boolean) => void;
};
