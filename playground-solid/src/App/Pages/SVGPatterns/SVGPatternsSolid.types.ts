import type { Signal } from "solid-js";

import type { AccessorValues, SVGDefsColors } from "@thewaver/ss-components-solid";
import type {
    BaseSVGPatternsSharedValues,
    BaseTimedPatternExampleValues,
    BaseTrackedPatternExampleValues,
} from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.types";

export type SVGPatternsSharedProps = AccessorValues<BaseSVGPatternsSharedValues>;

export type SVGPatternsControls = {
    cellSize: Signal<number>;
    blurWidth: Signal<number>;
    colors: SVGDefsColors;
    setColor: (key: keyof SVGDefsColors, value: string) => void;
};

export type TimedPatternExampleProps = SVGPatternsSharedProps & AccessorValues<BaseTimedPatternExampleValues>;

export type TrackedPatternExampleProps = SVGPatternsSharedProps & AccessorValues<BaseTrackedPatternExampleValues>;
