import type { Ref } from "vue";

import type { SVGDefsColors } from "@thewaver/ss-components-vue";
import type {
    BaseSVGPatternsSharedProps,
    BaseTimedPatternExampleProps,
    BaseTrackedPatternExampleProps,
} from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.types";

export type SVGPatternsSharedProps = BaseSVGPatternsSharedProps;

export type SVGPatternsControls = {
    cellSize: Ref<number>;
    blurWidth: Ref<number>;
    colors: SVGDefsColors;
    setColor: (key: keyof SVGDefsColors, value: string) => void;
};

export type TimedPatternExampleProps = BaseTimedPatternExampleProps;

export type TrackedPatternExampleProps = BaseTrackedPatternExampleProps;
