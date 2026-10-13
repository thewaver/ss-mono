import type { AccessorProps, SignalSource } from "@thewaver/ss-components-solid";

export type { WraparoundExampleProps } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.types";

export type WraparoundMarqueeExampleProps = AccessorProps<{
    driftPxPerSecond: number;
    driftDegrees: number;
    playback: SignalSource<boolean>;
}>;
