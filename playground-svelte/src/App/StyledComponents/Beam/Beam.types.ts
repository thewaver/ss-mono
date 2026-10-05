export type PageBeamDirection = "forward" | "backward";

export type PageBeamProps = {
    d: string;
    direction: PageBeamDirection;
    isPlaying: boolean;
    routeStartPx?: number;
    routeLengthPx?: number;
    onLengthPx?: (lengthPx: number | undefined) => void;
};
