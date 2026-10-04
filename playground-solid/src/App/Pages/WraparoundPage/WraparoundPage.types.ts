import type { AccessorProps, SignalSource } from "@thewaver/ss-components-solid";

export type WraparoundExampleProps = {
    onPress: (name: string) => void;
};

export type WraparoundMarqueeExampleProps = AccessorProps<{
    driftPxPerSecond: number;
    driftDegrees: number;
    playback: SignalSource<boolean>;
}>;
