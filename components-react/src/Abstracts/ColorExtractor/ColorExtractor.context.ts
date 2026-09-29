import { createContext, useContext, useEffect, useState } from "react";

import { ColorExtractorUtils } from "@thewaver/ss-components";

import { useStore } from "../../Utils/storeUtils";
import type { ColorExtractorContextType } from "./ColorExtractor.context.types";

const ColorExtractorContext = createContext<ColorExtractorContextType | undefined>(undefined);

export const ColorExtractorContextProvider = ColorExtractorContext.Provider;

export const useColorExtractor = (props?: ColorExtractorContextType) => {
    const [extractor] = useState(ColorExtractorUtils.createExtractor);

    const src = props?.src;
    const colorCount = props?.colorCount;
    const samplePercentile = props?.samplePercentile;

    useEffect(
        () => (src ? extractor.load(src, { colorCount, samplePercentile }) : undefined),
        [extractor, src, colorCount, samplePercentile],
    );

    return {
        colors: useStore(extractor, (state) => state.colors),
        error: useStore(extractor, (state) => state.error),
    };
};

export const useColorExtractorContext = () => useColorExtractor(useContext(ColorExtractorContext));
