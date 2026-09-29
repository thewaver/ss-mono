export type ColorExtractorContextType = {
    getSrc: () => string | undefined;
    getColorCount?: () => number | undefined;
    getSamplePercentile?: () => number | undefined;
};
