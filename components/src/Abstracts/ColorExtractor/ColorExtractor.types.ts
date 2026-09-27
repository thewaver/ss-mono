import type { Color } from "colorthief";

import type { Store } from "@thewaver/ss-utils";

export type ColorExtractorState = {
    colors: Color[];
    error: unknown;
};

export type ColorExtractorDefs = {
    colorCount?: number;
    samplePercentile?: number;
};

export type ColorExtractor = Store<ColorExtractorState> & {
    load: (src: string, defs?: ColorExtractorDefs) => () => void;
};
