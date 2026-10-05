import type { AccessorProps } from "@thewaver/ss-components-solid";

export type PageBeamDirection = "forward" | "backward";

export type PageBeamProps = AccessorProps<{
    d: string;
    direction: PageBeamDirection;
    isPlaying: boolean;
    routeStartPx?: number;
    routeLengthPx?: number;
}> & {
    onLengthPx?: (lengthPx: number | undefined) => void;
};
