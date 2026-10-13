import type { SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { WithNoSample } from "../../PageComponents/SampleGroups/SampleGroups.types";

export type BaseSVGPatternsSharedValues = {
    colors: SVGDefsColors;
    cellSize: Size2d;
    blurWidth?: number;
};

export type BaseSVGPatternsSharedProps = BaseSVGPatternsSharedValues;

export type BaseTimedPatternExampleValues = {
    configKey: WithNoSample<SVGDefsSamples.Pattern.Timed.SampleKey>;
    iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
    animationDurationMs: number;
};

export type BaseTimedPatternExampleProps = BaseSVGPatternsSharedProps & BaseTimedPatternExampleValues;

export type BaseTrackedPatternExampleValues = {
    configKey: WithNoSample<SVGDefsSamples.Pattern.Tracked.SampleKey>;
    configDefs: Record<string, number | boolean>;
};

export type BaseTrackedPatternExampleProps = BaseSVGPatternsSharedProps & BaseTrackedPatternExampleValues;
