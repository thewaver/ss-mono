import { createContext, createEffect, onCleanup, useContext } from "solid-js";

import { ColorExtractorUtils } from "@thewaver/ss-components";

import { accessStore } from "../../Utils/storeUtils";
import type { ColorExtractorContextType } from "./ColorExtractorSolid.context.types";

const ColorExtractorContext = createContext<ColorExtractorContextType>();

export const ColorExtractorContextProvider = ColorExtractorContext.Provider;

export const useColorExtractor = (props?: ColorExtractorContextType) => {
    const extractor = ColorExtractorUtils.createExtractor();

    createEffect(() => {
        const src = props?.getSrc();

        if (!src) return;

        onCleanup(
            extractor.load(src, {
                colorCount: props?.getColorCount?.(),
                samplePercentile: props?.getSamplePercentile?.(),
            }),
        );
    });

    return {
        getColorData: accessStore(extractor, (state) => state.colors),
        getError: accessStore(extractor, (state) => state.error),
    };
};

export const useColorExtractorContext = () => {
    const context = useContext(ColorExtractorContext);

    return useColorExtractor(context);
};
