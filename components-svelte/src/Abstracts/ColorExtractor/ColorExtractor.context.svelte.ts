import { createContext, untrack } from "svelte";

import { ColorExtractorUtils } from "@thewaver/ss-components";

import { readStore } from "../../Utils/storeUtils.js";
import type { ColorExtractorContextType } from "./ColorExtractor.context.types.js";

const [getContext, setContext, hasContext] = createContext<ColorExtractorContextType>();

export const setColorExtractorContext = (context: ColorExtractorContextType) => setContext(context);

export const createColorExtractor = (context?: ColorExtractorContextType) => {
    const extractor = ColorExtractorUtils.createExtractor();

    $effect(() => {
        const src = context?.getSrc();
        const colorCount = context?.getColorCount?.();
        const samplePercentile = context?.getSamplePercentile?.();

        if (!src) return;

        return untrack(() => extractor.load(src, { colorCount, samplePercentile }));
    });

    return {
        getColorData: readStore(extractor, (state) => state.colors),
        getError: readStore(extractor, (state) => state.error),
    };
};

export const getColorExtractorContext = () => createColorExtractor(hasContext() ? getContext() : undefined);
