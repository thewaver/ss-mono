export type ShadowCasterExampleProps = {
    isDisabled: () => boolean;
    activeRangePx: () => number;
    lightRangePx: () => number;
    maxThrowPx: () => number;
    minBlurPx: () => number;
    maxBlurPx: () => number;
    maxOpacity: () => number;
    minOpacity: () => number;
    restingOpacity: () => number;
    color: () => string;
};
