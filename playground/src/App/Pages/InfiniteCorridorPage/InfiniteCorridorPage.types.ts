export type BaseInfiniteCorridorExampleValues = {
    items: string[];
    glideDurationMs: number;
    spinDegreesPerSecond: number;
};

export type BaseInfiniteCorridorScrolledExampleValues = BaseInfiniteCorridorExampleValues & {
    scrollLength: number;
};

export type BaseInfiniteCorridorClockExampleValues = BaseInfiniteCorridorExampleValues & {
    lapMs: number;
};
