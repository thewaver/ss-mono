import type { ColorExtractorContextType } from "./ColorExtractor.context.types.js";
export declare const setColorExtractorContext: (context: ColorExtractorContextType) => ColorExtractorContextType;
export declare const createColorExtractor: (context?: ColorExtractorContextType) => {
    getColorData: () => import("colorthief").Color[];
    getError: () => unknown;
};
export declare const getColorExtractorContext: () => {
    getColorData: () => import("colorthief").Color[];
    getError: () => unknown;
};
