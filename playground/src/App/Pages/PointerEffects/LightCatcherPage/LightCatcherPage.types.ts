export type LightCatcherExampleProps = {
    isDisabled: () => boolean;
    activeRangePx: () => number;
    smoothingMs: () => number;
    lightRangePx: () => number;
    maxBrightness: () => number;
    restingBrightness: () => number;
    maxLightness: () => number;
    restingLightness: () => number;
};
