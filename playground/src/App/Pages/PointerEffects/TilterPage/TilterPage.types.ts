export type TilterExampleProps = {
    isDisabled: () => boolean;
    activeRangePx: () => number;
    smoothingMs: () => number;
    tiltRangePx: () => number;
    maxTiltDegrees: () => number;
    perspectivePx: () => number;
    sheenOpacity: () => number;
    sheenSpreadPercent: () => number;
};
