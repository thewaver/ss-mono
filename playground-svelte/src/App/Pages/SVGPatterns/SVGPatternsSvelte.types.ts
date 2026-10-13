import type { SVGDefsColors, ValuePair } from "@thewaver/ss-components-svelte";
import type {
    BaseSVGPatternsSharedProps,
    BaseTimedPatternExampleProps,
    BaseTrackedPatternExampleProps,
} from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.types";

export type SVGPatternsSharedProps = BaseSVGPatternsSharedProps;

export type SVGPatternsControls = {
    cellSize: ValuePair<number>;
    blurWidth: ValuePair<number>;
    colors: SVGDefsColors;
    setColor: (key: keyof SVGDefsColors, value: string) => void;
};

export type TimedPatternExampleProps = BaseTimedPatternExampleProps;

export type TrackedPatternExampleProps = BaseTrackedPatternExampleProps;
