export type LightCatcherExampleProps = {
    isDisabled: () => boolean;
    activeRangePx: () => number;
    lightRangePx: () => number;
    maxBrightness: () => number;
    restingBrightness: () => number;
    maxLightness: () => number;
    restingLightness: () => number;
};
