import type { AccessorProps, SignalSource, TimelineSpan } from "@thewaver/ss-components";

export type Meeting = {
    name: string;
    room: string;
    from: number;
    to: number;
    isCancelled?: boolean;
};

export type Clip = {
    name: string;
    track: number;
    from: number;
    to: number;
};

export type TimelineExampleProps = AccessorProps<{
    laneSize: number;
    minTickGap: number;
    isPannable: boolean;
    isZoomable: boolean;
    isDisabled: boolean;
    viewSignal: SignalSource<TimelineSpan>;
    onPick: (name: string) => void;
}>;
