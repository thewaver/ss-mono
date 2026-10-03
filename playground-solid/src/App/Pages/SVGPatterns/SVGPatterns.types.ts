import type { Signal } from "solid-js";

import type { AccessorProps, SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components-solid";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import type { Size2d } from "@thewaver/ss-utils";

export type SVGPatternsSharedProps = AccessorProps<{
    colors: SVGDefsColors;
    cellSize: Size2d;
    blurWidth?: number;
}>;

export type SVGPatternsControls = {
    cellSize: Signal<number>;
    blurWidth: Signal<number>;
    colors: SVGDefsColors;
    setColor: (key: keyof SVGDefsColors, value: string) => void;
};

export type TimedPatternExampleProps = SVGPatternsSharedProps &
    AccessorProps<{
        configKey: WithNoSample<SVGDefsSamples.Pattern.Timed.SampleKey>;
        iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
        animationDurationMs: number;
    }>;

export type TrackedPatternExampleProps = SVGPatternsSharedProps &
    AccessorProps<{
        configKey: WithNoSample<SVGDefsSamples.Pattern.Tracked.SampleKey>;
        configDefs: Record<string, number | boolean>;
    }>;
