import type { SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components-react";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import type { Size2d } from "@thewaver/ss-utils";

export type SVGPatternsSharedProps = {
    colors: SVGDefsColors;
    cellSize: Size2d;
    blurWidth?: number;
};

export type SVGPatternsControls = {
    cellSize: readonly [number, (cellSize: number) => void];
    blurWidth: readonly [number, (blurWidth: number) => void];
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
