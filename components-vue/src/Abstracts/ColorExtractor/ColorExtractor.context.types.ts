import type { MaybeRefOrGetter } from "vue";

export type ColorExtractorContextType = {
    src?: MaybeRefOrGetter<string | undefined>;
    colorCount?: MaybeRefOrGetter<number | undefined>;
    samplePercentile?: MaybeRefOrGetter<number | undefined>;
};
