export type TilterExampleProps = {
    isDisabled: () => boolean;
    activeRangePx: () => number;
    tiltRangePx: () => number;
    maxTiltDegrees: () => number;
    perspectivePx: () => number;
    sheenOpacity: () => number;
    sheenSpreadPercent: () => number;
};
