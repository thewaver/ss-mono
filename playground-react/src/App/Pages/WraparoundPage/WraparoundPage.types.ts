export type WraparoundExampleProps = {
    onPress: (name: string) => void;
};

export type WraparoundMarqueeExampleProps = {
    driftPxPerSecond: number;
    driftDegrees: number;
    playback: readonly [boolean, (value: boolean) => void];
};
