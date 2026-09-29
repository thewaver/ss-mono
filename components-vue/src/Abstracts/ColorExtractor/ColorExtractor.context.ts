import { type InjectionKey, inject, provide, toValue } from "vue";

import { ColorExtractorUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { useStore } from "../../Utils/storeUtils";
import type { ColorExtractorContextType } from "./ColorExtractor.context.types";

const COLOR_EXTRACTOR_CONTEXT_KEY: InjectionKey<ColorExtractorContextType> = Symbol("ColorExtractorContext");

export const provideColorExtractorContext = (context: ColorExtractorContextType) =>
    provide(COLOR_EXTRACTOR_CONTEXT_KEY, context);

export const useColorExtractor = (props?: ColorExtractorContextType) => {
    const extractor = ColorExtractorUtils.createExtractor();

    watchAfterRender(
        [() => toValue(props?.src), () => toValue(props?.colorCount), () => toValue(props?.samplePercentile)],
        ([src, colorCount, samplePercentile]) =>
            src ? extractor.load(src, { colorCount, samplePercentile }) : undefined,
    );

    return {
        colors: useStore(extractor, (state) => state.colors),
        error: useStore(extractor, (state) => state.error),
    };
};

export const useColorExtractorContext = () => useColorExtractor(inject(COLOR_EXTRACTOR_CONTEXT_KEY, undefined));
