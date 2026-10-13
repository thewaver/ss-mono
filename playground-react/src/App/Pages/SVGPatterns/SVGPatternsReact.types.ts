import type { SVGDefsColors } from "@thewaver/ss-components-react";
import type {
    BaseSVGPatternsSharedProps,
    BaseTimedPatternExampleProps,
    BaseTrackedPatternExampleProps,
} from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.types";

export type SVGPatternsSharedProps = BaseSVGPatternsSharedProps;

export type SVGPatternsControls = {
    cellSize: readonly [number, (cellSize: number) => void];
    blurWidth: readonly [number, (blurWidth: number) => void];
    colors: SVGDefsColors;
    setColor: (key: keyof SVGDefsColors, value: string) => void;
};

export type TimedPatternExampleProps = BaseTimedPatternExampleProps;

export type TrackedPatternExampleProps = BaseTrackedPatternExampleProps;
