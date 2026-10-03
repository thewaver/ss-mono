import type { SVGDefsColors, SVGDefsSamples, ValuePair } from "@thewaver/ss-components-svelte";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import type { Size2d } from "@thewaver/ss-utils";

export type SVGPatternsSharedProps = {
    colors: SVGDefsColors;
    cellSize: Size2d;
    blurWidth?: number;
};

export type SVGPatternsControls = {
    cellSize: ValuePair<number>;
    blurWidth: ValuePair<number>;
    colors: SVGDefsColors;
    setColor: (key: keyof SVGDefsColors, value: string) => void;
};

export type TimedPatternExampleProps = SVGPatternsSharedProps & {
    configKey: WithNoSample<SVGDefsSamples.Pattern.Timed.SampleKey>;
    iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
    animationDurationMs: number;
};

export type TrackedPatternExampleProps = SVGPatternsSharedProps & {
    configKey: WithNoSample<SVGDefsSamples.Pattern.Tracked.SampleKey>;
    configDefs: Record<string, number | boolean>;
};
